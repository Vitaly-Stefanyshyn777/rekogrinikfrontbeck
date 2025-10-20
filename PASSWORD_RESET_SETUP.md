# 🔐 Налаштування зміни паролю

## ⚠️ Поточний стан

**Зміна паролю тимчасово відключена** для розробки. Коди генеруються і зберігаються в БД, але email НЕ надсилається.

## 🚀 Як увімкнути зміну паролю

### Варіант 1: SendGrid (рекомендовано)

1. Зареєструйся на [sendgrid.com](https://sendgrid.com)
2. Отримай API ключ
3. Додай в `.env`:

```bash
SENDGRID_API_KEY=твій-api-ключ
SMTP_FROM="RekoGrinik <noreply@твій-домен.com>"
```

### Варіант 2: Gmail SMTP

1. Увімкни 2FA в Google
2. Створи App Password
3. Додай в `.env`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=твій-gmail@gmail.com
SMTP_PASS=твій-app-password
SMTP_FROM="RekoGrinik <твій-gmail@gmail.com>"
```

### Варіант 3: Інший SMTP провайдер

Налаштуй змінні в `.env`:

```bash
SMTP_HOST=smtp.провайдер.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=твій-email
SMTP_PASS=твій-пароль
SMTP_FROM="RekoGrinik <твій-email>"
```

## 🔧 Ендпоїнти

- `POST /api/v1/auth/request-password-reset` - надіслати код
- `POST /api/v1/auth/reset-password-code` - змінити пароль з кодом

## 📝 Примітки

- Коди завжди надсилаються на `ADMIN_EMAIL` (налаштовується в `.env`)
- Коди дійсні 30 хвилин
- Після налаштування SMTP перезапусти сервер


