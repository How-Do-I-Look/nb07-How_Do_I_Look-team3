/*
  Warnings:

  - You are about to drop the column `author` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `performance` on the `Curation` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `Curation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Curation" DROP COLUMN "author",
DROP COLUMN "performance",
ADD COLUMN     "costEffectiveness" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nickname" TEXT NOT NULL;
