import { Injectable, Logger } from "@nestjs/common";
import nodemailer from "nodemailer";
import * as sgMail from "@sendgrid/mail";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendPasswordResetCode(
    email: string,
    code: string
  ): Promise<{ previewUrl?: string }> {
    const {
      SENDGRID_API_KEY,
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM,
    } = process.env as Record<string, string | undefined>;

    // Перевіряємо, чи є SendGrid API ключ
    if (SENDGRID_API_KEY) {
      sgMail.setApiKey(SENDGRID_API_KEY);

      const msg = {
        to: email,
        from: SMTP_FROM || "noreply@rekogrinik.com",
        subject: "Код підтвердження для зміни паролю",
        text: `Ваш код: ${code}`,
        html: `<p>Ваш код підтвердження: <b>${code}</b></p>`,
      };

      await sgMail.send(msg);
      this.logger.log(`Reset code sent to ${email} via SendGrid`);
      return {};
    }

    // Fallback до SMTP або Ethereal
    let transporter: nodemailer.Transporter;
    let fromAddress = SMTP_FROM || "RekoGrinik <no-reply@rekogrinik.local>";
    let useEthereal = false;

    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
      transporter = nodemailer.createTransporter({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: (SMTP_SECURE || "false").toLowerCase() === "true",
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
    } else {
      // Fallback to Ethereal test account for dev
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransporter({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      useEthereal = true;
      fromAddress = fromAddress || `RekoGrinik <${testAccount.user}>`;
    }

    const info = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Код підтвердження для зміни паролю",
      text: `Ваш код: ${code}`,
      html: `<p>Ваш код підтвердження: <b>${code}</b></p>`,
    });

    const previewUrl = useEthereal
      ? nodemailer.getTestMessageUrl(info) || undefined
      : undefined;
    this.logger.log(
      `Reset code sent to ${email};${
        previewUrl ? ` preview: ${previewUrl}` : ""
      }`
    );
    return { previewUrl };
  }
}
