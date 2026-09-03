-- ====================================================
-- Безпечна міграція — нічого не видаляється і не змінюється
-- Додає лише те, чого немає в базі
-- ====================================================

-- 1. Enum Role (якщо ще не існує)
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Enum AlbumType (якщо ще не існує)
DO $$ BEGIN
  CREATE TYPE "AlbumType" AS ENUM ('GENERAL', 'BEFORE_AFTER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Додати колонки до User (якщо не існують)
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'USER',
  ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

-- 4. ContentBlock
CREATE TABLE IF NOT EXISTS "ContentBlock" (
    "id"            SERIAL       NOT NULL,
    "blockNumber"   INTEGER      NOT NULL,
    "name"          TEXT         NOT NULL,
    "text"          TEXT,
    "imageUrl"      TEXT,
    "imagePublicId" TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ContentBlock_blockNumber_key" ON "ContentBlock"("blockNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "ContentBlock_name_key"        ON "ContentBlock"("name");

-- 5. Album
CREATE TABLE IF NOT EXISTS "Album" (
    "id"        SERIAL       NOT NULL,
    "name"      TEXT         NOT NULL,
    "slug"      TEXT         NOT NULL,
    "type"      "AlbumType"  NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Album_slug_key" ON "Album"("slug");

-- 6. GalleryPhoto
CREATE TABLE IF NOT EXISTS "GalleryPhoto" (
    "id"          SERIAL       NOT NULL,
    "albumId"     INTEGER      NOT NULL,
    "url"         TEXT         NOT NULL,
    "publicId"    TEXT,
    "title"       TEXT,
    "description" TEXT,
    "tag"         TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GalleryPhoto_pkey" PRIMARY KEY ("id")
);
DO $$ BEGIN
  ALTER TABLE "GalleryPhoto"
    ADD CONSTRAINT "GalleryPhoto_albumId_fkey"
    FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 7. BeforeAfterPair
CREATE TABLE IF NOT EXISTS "BeforeAfterPair" (
    "id"            SERIAL       NOT NULL,
    "albumId"       INTEGER      NOT NULL,
    "beforePhotoId" INTEGER      NOT NULL,
    "afterPhotoId"  INTEGER      NOT NULL,
    "label"         TEXT,
    "collectionId"  INTEGER,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BeforeAfterPair_pkey" PRIMARY KEY ("id")
);
DO $$ BEGIN
  ALTER TABLE "BeforeAfterPair"
    ADD CONSTRAINT "BeforeAfterPair_albumId_fkey"
    FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "BeforeAfterPair"
    ADD CONSTRAINT "BeforeAfterPair_beforePhotoId_fkey"
    FOREIGN KEY ("beforePhotoId") REFERENCES "GalleryPhoto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "BeforeAfterPair"
    ADD CONSTRAINT "BeforeAfterPair_afterPhotoId_fkey"
    FOREIGN KEY ("afterPhotoId") REFERENCES "GalleryPhoto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 8. PasswordResetToken
CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
    "id"        SERIAL       NOT NULL,
    "userId"    INTEGER      NOT NULL,
    "token"     TEXT         NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used"      BOOLEAN      NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code"      TEXT,
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
DO $$ BEGIN
  ALTER TABLE "PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 9. ApiToken
CREATE TABLE IF NOT EXISTS "ApiToken" (
    "id"        SERIAL       NOT NULL,
    "jti"       TEXT         NOT NULL,
    "userId"    INTEGER      NOT NULL,
    "label"     TEXT,
    "revoked"   BOOLEAN      NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    CONSTRAINT "ApiToken_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ApiToken_jti_key" ON "ApiToken"("jti");
DO $$ BEGIN
  ALTER TABLE "ApiToken"
    ADD CONSTRAINT "ApiToken_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 10. Hero
CREATE TABLE IF NOT EXISTS "Hero" (
    "id"              SERIAL       NOT NULL,
    "title"           TEXT         NOT NULL,
    "subtitle"        TEXT         NOT NULL,
    "backgroundImage" TEXT,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- 11. FormSubmission
CREATE TABLE IF NOT EXISTS "FormSubmission" (
    "id"          SERIAL       NOT NULL,
    "name"        TEXT         NOT NULL,
    "phone"       TEXT         NOT NULL,
    "email"       TEXT,
    "workType"    TEXT,
    "message"     TEXT,
    "consent"     BOOLEAN      NOT NULL DEFAULT false,
    "address"     TEXT,
    "contactTime" TEXT,
    "source"      JSONB,
    "files"       JSONB,
    "locale"      TEXT         DEFAULT 'uk',
    "userAgent"   TEXT,
    "ip"          TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);
