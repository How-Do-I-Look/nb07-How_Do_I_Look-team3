/*
  Warnings:

  - You are about to drop the column `author` on the `Reply` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `Reply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "author",
ADD COLUMN     "nickname" TEXT NOT NULL;
