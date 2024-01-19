/*
  Warnings:

  - Made the column `coverImageId` on table `Story` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_coverImageId_fkey";

-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "coverImageId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
