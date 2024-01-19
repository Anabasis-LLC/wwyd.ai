-- DropForeignKey
ALTER TABLE "UserStoryChoice" DROP CONSTRAINT "UserStoryChoice_storyId_fkey";

-- DropForeignKey
ALTER TABLE "UserStoryChoice" DROP CONSTRAINT "UserStoryChoice_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserStoryChoice" ADD CONSTRAINT "UserStoryChoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStoryChoice" ADD CONSTRAINT "UserStoryChoice_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
