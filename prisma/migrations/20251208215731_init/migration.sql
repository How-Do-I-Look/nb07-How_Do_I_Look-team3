-- CreateEnum
CREATE TYPE "StyleCategory" AS ENUM ('TOP', 'BOTTOM', 'OUTER', 'ONEPIECE', 'SHOES', 'BAG', 'ACCESSORY');

-- CreateTable
CREATE TABLE "Style" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "curation_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleTag" (
    "id" BIGSERIAL NOT NULL,
    "style_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "StyleTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleItem" (
    "id" BIGSERIAL NOT NULL,
    "style_id" BIGINT NOT NULL,
    "item_name" TEXT NOT NULL,
    "brand_name" TEXT NOT NULL,
    "category" "StyleCategory" NOT NULL,
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "StyleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleImage" (
    "id" BIGSERIAL NOT NULL,
    "style_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "StyleImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curation" (
    "id" BIGSERIAL NOT NULL,
    "style_id" BIGINT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "trendy" INTEGER NOT NULL DEFAULT 0,
    "personality" INTEGER NOT NULL DEFAULT 0,
    "practicality" INTEGER NOT NULL DEFAULT 0,
    "performance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Curation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" BIGSERIAL NOT NULL,
    "curation_id" BIGINT NOT NULL,
    "password" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Style_created_at_idx" ON "Style"("created_at");

-- CreateIndex
CREATE INDEX "Style_views_idx" ON "Style"("views");

-- CreateIndex
CREATE INDEX "Style_curation_count_idx" ON "Style"("curation_count");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "StyleTag_tag_id_idx" ON "StyleTag"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "StyleTag_style_id_tag_id_key" ON "StyleTag"("style_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "StyleItem_style_id_category_key" ON "StyleItem"("style_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Reply_curation_id_key" ON "Reply"("curation_id");

-- AddForeignKey
ALTER TABLE "StyleTag" ADD CONSTRAINT "StyleTag_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleTag" ADD CONSTRAINT "StyleTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleItem" ADD CONSTRAINT "StyleItem_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleImage" ADD CONSTRAINT "StyleImage_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curation" ADD CONSTRAINT "Curation_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_curation_id_fkey" FOREIGN KEY ("curation_id") REFERENCES "Curation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
