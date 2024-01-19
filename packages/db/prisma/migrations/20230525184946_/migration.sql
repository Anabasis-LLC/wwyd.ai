-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "encryptedPassword" TEXT,
    "magicTokenSalt" TEXT,
    "timeZone" TEXT NOT NULL DEFAULT 'GMT',
    "emailVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OauthConnection" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OauthConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "checksum" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" INTEGER NOT NULL,
    "coverImageId" INTEGER,
    "title" VARCHAR(70) NOT NULL,
    "tagline" VARCHAR(140) NOT NULL,
    "hook" TEXT NOT NULL,
    "chapterCount" INTEGER NOT NULL,
    "choiceCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryEnding" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "storyId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryEnding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryChapter" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "storyId" INTEGER NOT NULL,
    "storyEndingId" INTEGER,
    "number" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryChoice" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "storyId" INTEGER NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStoryChoice" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" INTEGER NOT NULL,
    "storyChoiceId" INTEGER NOT NULL,
    "storyId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStoryChoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OauthConnection_uuid_key" ON "OauthConnection"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "OauthConnection_provider_providerId_key" ON "OauthConnection"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_uuid_key" ON "Image"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Story_uuid_key" ON "Story"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "StoryEnding_uuid_key" ON "StoryEnding"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "StoryChapter_uuid_key" ON "StoryChapter"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "StoryChapter_storyId_path_key" ON "StoryChapter"("storyId", "path");

-- CreateIndex
CREATE UNIQUE INDEX "StoryChoice_uuid_key" ON "StoryChoice"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UserStoryChoice_uuid_key" ON "UserStoryChoice"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "UserStoryChoice_userId_storyId_number_key" ON "UserStoryChoice"("userId", "storyId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "UserStoryChoice_userId_storyId_path_key" ON "UserStoryChoice"("userId", "storyId", "path");

-- AddForeignKey
ALTER TABLE "OauthConnection" ADD CONSTRAINT "OauthConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryEnding" ADD CONSTRAINT "StoryEnding_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryChapter" ADD CONSTRAINT "StoryChapter_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryChapter" ADD CONSTRAINT "StoryChapter_storyEndingId_fkey" FOREIGN KEY ("storyEndingId") REFERENCES "StoryEnding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryChoice" ADD CONSTRAINT "StoryChoice_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryChoice" ADD CONSTRAINT "StoryChoice_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "StoryChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStoryChoice" ADD CONSTRAINT "UserStoryChoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStoryChoice" ADD CONSTRAINT "UserStoryChoice_storyChoiceId_fkey" FOREIGN KEY ("storyChoiceId") REFERENCES "StoryChoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStoryChoice" ADD CONSTRAINT "UserStoryChoice_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
