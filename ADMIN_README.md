# 🎛️ **ADMIN PANEL API DOCUMENTATION**

## 📋 **Огляд системи**

Адмінська панель для управління контентом сайту RekoGrinik з повним CRUD функціоналом для:

- **Hero секції** (головна секція сайту)
- **Контент блоки** (текстові секції)
- **Галерея фото** (загальна + "До і Після")
- **Завантаження зображень** (Cloudinary інтеграція)

---

## 🔐 **АВТОРИЗАЦІЯ**

### **Логін адміністратора:**

```javascript
// POST /api/v1/auth/login
const loginResponse = await fetch("http://localhost:3002/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // ВАЖЛИВО!
  body: JSON.stringify({
    email: "admin@example.com",
    password: "R3k0gr1n1k@Admin#2024",
  }),
});

const { user, accessToken } = await loginResponse.json();
// Токен автоматично зберігається в cookies
```

### **Перевірка авторизації:**

```javascript
// Всі адмінські запити повинні включати credentials
const response = await fetch("http://localhost:3002/api/v1/content", {
  credentials: "include", // ВАЖЛИВО!
});
```

---

## 🎨 **HERO СЕКЦІЯ**

### **1. Отримати Hero:**

```javascript
// GET /api/v1/hero
const hero = await fetch("http://localhost:3002/api/v1/hero", {
  credentials: "include",
});
```

### **2. Створити/Оновити Hero:**

```javascript
// POST /api/v1/hero
const heroData = {
  title: "RekoGrinik – Rekonstrukce bytů a domů v Praze",
  subtitle: "Kompletní rekonstrukce na klíč, pevné rozpočty a termíny",
  backgroundImage: "https://res.cloudinary.com/dtgwh12jz/image/upload/...",
};

const response = await fetch("http://localhost:3002/api/v1/hero", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(heroData),
});
```

### **3. Оновити Hero:**

```javascript
// PUT /api/v1/hero
const updateData = {
  title: "Новий заголовок",
  subtitle: "Новий підзаголовок",
};

const response = await fetch("http://localhost:3002/api/v1/hero", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(updateData),
});
```

### **4. Видалити Hero:**

```javascript
// DELETE /api/v1/hero
const response = await fetch("http://localhost:3002/api/v1/hero", {
  method: "DELETE",
  credentials: "include",
});
```

---

## 📝 **КОНТЕНТ БЛОКИ**

### **1. Отримати всі блоки:**

```javascript
// GET /api/v1/content
const contentBlocks = await fetch("http://localhost:3002/api/v1/content", {
  credentials: "include",
});
```

### **2. Отримати блок за ID:**

```javascript
// GET /api/v1/content/:id
const block = await fetch("http://localhost:3002/api/v1/content/2", {
  credentials: "include",
});
```

### **3. Створити новий блок:**

```javascript
// POST /api/v1/content
const newBlock = {
  blockNumber: 10,
  name: "Нова секція",
  text: "Текст нової секції",
  imageUrl: "https://res.cloudinary.com/...",
};

const response = await fetch("http://localhost:3002/api/v1/content", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(newBlock),
});
```

### **4. Оновити блок:**

```javascript
// PUT /api/v1/content/:id
const updateData = {
  name: "Оновлена секція",
  text: "Оновлений текст",
  imageUrl: "https://res.cloudinary.com/...",
};

const response = await fetch("http://localhost:3002/api/v1/content/2", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(updateData),
});
```

### **5. Видалити блок:**

```javascript
// DELETE /api/v1/content/:id
const response = await fetch("http://localhost:3002/api/v1/content/2", {
  method: "DELETE",
  credentials: "include",
});
```

---

## 🖼️ **ГАЛЕРЕЯ - АЛЬБОМИ**

### **1. Отримати всі альбоми:**

```javascript
// GET /api/v1/gallery/albums
const albums = await fetch("http://localhost:3002/api/v1/gallery/albums", {
  credentials: "include",
});
```

### **2. Створити альбом:**

```javascript
// POST /api/v1/gallery/albums
const newAlbum = {
  name: "Новий альбом",
  slug: "noviy-album",
  type: "GENERAL", // або "BEFORE_AFTER"
};

const response = await fetch("http://localhost:3002/api/v1/gallery/albums", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(newAlbum),
});
```

### **3. Оновити альбом:**

```javascript
// PUT /api/v1/gallery/albums/:id
const updateData = {
  name: "Оновлений альбом",
  slug: "obnovleniy-album",
};

const response = await fetch("http://localhost:3002/api/v1/gallery/albums/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(updateData),
});
```

### **4. Видалити альбом:**

```javascript
// DELETE /api/v1/gallery/albums/:id
const response = await fetch("http://localhost:3002/api/v1/gallery/albums/1", {
  method: "DELETE",
  credentials: "include",
});
```

---

## 📸 **ГАЛЕРЕЯ - ФОТО**

### **1. Отримати фото альбому:**

```javascript
// GET /api/v1/gallery/albums/:albumId/photos
const photos = await fetch(
  "http://localhost:3002/api/v1/gallery/albums/2/photos",
  {
    credentials: "include",
  }
);

// З фільтрацією за міткою
const beforePhotos = await fetch(
  "http://localhost:3002/api/v1/gallery/albums/2/photos?tag=before",
  {
    credentials: "include",
  }
);
```

### **2. Завантажити фото (через Cloudinary):**

```javascript
// POST /api/v1/upload/photo
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("albumId", "2");
formData.append("title", "Назва фото");
formData.append("description", "Опис фото");
formData.append("tag", "before"); // або 'after', 'general'

const response = await fetch("http://localhost:3002/api/v1/upload/photo", {
  method: "POST",
  credentials: "include",
  body: formData,
});
```

### **3. Оновити фото:**

```javascript
// PUT /api/v1/gallery/photos/:id
const updateData = {
  title: "Нова назва",
  description: "Новий опис",
  tag: "after",
};

const response = await fetch("http://localhost:3002/api/v1/gallery/photos/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(updateData),
});
```

### **4. Видалити фото:**

```javascript
// DELETE /api/v1/gallery/photos/:id
const response = await fetch("http://localhost:3002/api/v1/gallery/photos/1", {
  method: "DELETE",
  credentials: "include",
});
```

---

## 🔄 **ПАРИ "ДО І ПІСЛЯ"**

### **1. Отримати пари альбому:**

```javascript
// GET /api/v1/gallery/albums/:albumId/pairs
const pairs = await fetch(
  "http://localhost:3002/api/v1/gallery/albums/2/pairs",
  {
    credentials: "include",
  }
);
```

### **2. Пересоздати пари автоматично:**

```javascript
// POST /api/v1/gallery/albums/:albumId/recreate-pairs
const response = await fetch(
  "http://localhost:3002/api/v1/gallery/albums/2/recreate-pairs",
  {
    method: "POST",
    credentials: "include",
  }
);
```

### **3. Створити пару вручну:**

```javascript
// POST /api/v1/gallery/pairs
const pairData = {
  albumId: 2,
  beforePhotoId: 1,
  afterPhotoId: 2,
  label: "Пара 1",
};

const response = await fetch("http://localhost:3002/api/v1/gallery/pairs", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(pairData),
});
```

### **4. Видалити пару:**

```javascript
// DELETE /api/v1/gallery/pairs/:id
const response = await fetch("http://localhost:3002/api/v1/gallery/pairs/1", {
  method: "DELETE",
  credentials: "include",
});
```

---

## 📤 **ЗАВАНТАЖЕННЯ ЗОБРАЖЕНЬ**

### **1. Завантажити тільки в Cloudinary:**

```javascript
// POST /api/v1/upload/image
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("http://localhost:3002/api/v1/upload/image", {
  method: "POST",
  credentials: "include",
  body: formData,
});

const { url, publicId } = await response.json();
```

### **2. Завантажити фото з автоматичним збереженням:**

```javascript
// POST /api/v1/upload/photo
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("albumId", "2");
formData.append("title", "Назва фото");
formData.append("description", "Опис фото");
formData.append("tag", "before"); // ВАЖЛИВО для "До і Після"

const response = await fetch("http://localhost:3002/api/v1/upload/photo", {
  method: "POST",
  credentials: "include",
  body: formData,
});
```

---

## 🎯 **ЛОГІКА РОБОТИ СИСТЕМИ**

### **📋 Автоматичне створення пар "До і Після":**

1. **Завантажте фото з мітками:**

   - `tag: "before"` - для фото "До"
   - `tag: "after"` - для фото "Після"

2. **Система автоматично:**

   - Фільтрує фото за мітками
   - Створює пари по 3+3 фото
   - Групує пари в колекції
   - Видаляє старі пари при оновленні

3. **Умови для створення пар:**
   - Мінімум 3 фото "До" (`tag: "before"`)
   - Мінімум 3 фото "Після" (`tag: "after"`)
   - Альбом типу `BEFORE_AFTER`

### **📱 Приклад роботи з фронтендом:**

```javascript
// 1. Логін
const login = await fetch("http://localhost:3002/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    email: "admin@example.com",
    password: "R3k0gr1n1k@Admin#2024",
  }),
});

// 2. Створити Hero
const hero = await fetch("http://localhost:3002/api/v1/hero", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    title: "RekoGrinik – Rekonstrukce bytů a domů v Praze",
    subtitle: "Kompletní rekonstrukce na klíč, pevné rozpočty a termíny",
    backgroundImage: "https://res.cloudinary.com/dtgwh12jz/image/upload/...",
  }),
});

// 3. Завантажити фото "До"
const formData = new FormData();
formData.append("file", beforeFile);
formData.append("albumId", "2");
formData.append("title", "До 1");
formData.append("tag", "before");

const uploadBefore = await fetch("http://localhost:3002/api/v1/upload/photo", {
  method: "POST",
  credentials: "include",
  body: formData,
});

// 4. Завантажити фото "Після"
const formDataAfter = new FormData();
formDataAfter.append("file", afterFile);
formDataAfter.append("albumId", "2");
formDataAfter.append("title", "Після 1");
formDataAfter.append("tag", "after");

const uploadAfter = await fetch("http://localhost:3002/api/v1/upload/photo", {
  method: "POST",
  credentials: "include",
  body: formDataAfter,
});

// 5. Пари створюються автоматично!
```

---

## ⚠️ **ВАЖЛИВІ МОМЕНТИ**

### **🔐 Авторизація:**

- **ВСІ адмінські запити** повинні включати `credentials: 'include'`
- Токен зберігається в **HttpOnly cookies**
- **НЕ передавайте токен в headers** - використовуйте cookies

### **📤 Завантаження файлів:**

- Використовуйте `FormData` для файлів
- **НЕ** додавайте `Content-Type` header для `multipart/form-data`
- Мітки `tag` обов'язкові для "До і Після" альбомів

### **🔄 Автоматичні пари:**

- Створюються автоматично при завантаженні фото
- Використовуйте `/recreate-pairs` для ручного пересоздання
- Мінімум 3+3 фото для створення пар

### **🌐 CORS:**

- Налаштовано для `credentials: true`
- Фронтенд повинен працювати на тому ж домені або налаштованому в `FRONTEND_URL`

---

## 🚀 **ШВИДКИЙ СТАРТ**

```javascript
// 1. Логін
const login = await fetch("http://localhost:3002/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    email: "admin@example.com",
    password: "R3k0gr1n1k@Admin#2024",
  }),
});

// 2. Перевірка авторизації
const content = await fetch("http://localhost:3002/api/v1/content", {
  credentials: "include",
});

if (content.ok) {
  console.log("✅ Авторизація працює!");
} else {
  console.log("❌ Проблема з авторизацією");
}
```

**Система готова до використання!** 🎉
