/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Story` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Story` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");
