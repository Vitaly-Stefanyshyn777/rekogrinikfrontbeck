import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FormSubmission } from "@prisma/client";

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken?: string;
  private readonly chatIds: string[];

  constructor(private readonly configService: ConfigService) {
    this.botToken = this.configService.get<string>("TELEGRAM_BOT_TOKEN");
    const chatIdConfig = this.configService.get<string>("TELEGRAM_CHAT_ID");

    // Підтримка кількох chat_id через кому: "123,456,-789"
    // Якщо один ID - працює як раніше, якщо кілька - відправляє всім
    this.chatIds = chatIdConfig
      ? chatIdConfig
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [];
  }

  async sendMessage(text: string) {
    if (!this.botToken) {
      this.logger.warn(
        "Telegram bot token is not configured. Skipping notification."
      );
      return;
    }

    if (this.chatIds.length === 0) {
      this.logger.warn(
        "Telegram chat IDs are not configured. Skipping notification."
      );
      return;
    }

    const apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    // Відправляємо повідомлення всім отримувачам паралельно
    const promises = this.chatIds.map(async (chatId) => {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.logger.error(
            `Failed to send Telegram message to ${chatId}: ${response.status} ${errorText}`
          );
        } else {
          this.logger.debug(`Telegram message sent successfully to ${chatId}`);
        }
      } catch (error) {
        this.logger.error(
          `Telegram message sending failed to ${chatId}`,
          error as Error
        );
      }
    });

    // Чекаємо завершення всіх відправок (навіть якщо деякі не вдалися)
    await Promise.allSettled(promises);
  }

  async notifyNewFormSubmission(
    submission: FormSubmission,
    meta?: { ip?: string; userAgent?: string }
  ) {
    const message = this.buildFormMessage(submission, meta);
    await this.sendMessage(message);
  }

  private buildFormMessage(
    submission: FormSubmission,
    meta?: { ip?: string; userAgent?: string }
  ) {
    const lines = [
      "📩 <b>Нова заявка з сайту</b>",
      "",
      `<b>Ім'я:</b> ${submission.name ?? "—"}`,
      `<b>Телефон:</b> ${submission.phone ?? "—"}`,
      `<b>Email:</b> ${submission.email ?? "—"}`,
      `<b>Тип робіт:</b> ${submission.workType ?? "—"}`,
      `<b>Адреса:</b> ${submission.address ?? "—"}`,
      `<b>Час зв'язку:</b> ${submission.contactTime ?? "—"}`,
      `<b>Повідомлення:</b>\n${submission.message ?? "—"}`,
      "",
      `<b>Згода на обробку:</b> ${submission.consent ? "✅" : "❌"}`,
      `<b>Мова:</b> ${submission.locale ?? "—"}`,
      `<b>Джерело:</b> ${
        submission.source ? JSON.stringify(submission.source) : "—"
      }`,
      `<b>Файли:</b> ${
        submission.files ? JSON.stringify(submission.files) : "—"
      }`,
      `<b>Створено:</b> ${submission.createdAt.toISOString()}`,
    ];

    if (meta?.ip || meta?.userAgent) {
      lines.push(
        "",
        `<b>IP:</b> ${meta.ip ?? "—"}`,
        `<b>User-Agent:</b> ${meta.userAgent ?? "—"}`
      );
    }

    return lines.join("\n");
  }
}
