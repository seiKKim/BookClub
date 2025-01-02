/*
  Warnings:

  - You are about to drop the column `bookAuthor` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookCreatedAt` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookDescription` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookTitle` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookUpdatedAt` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookUserId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionCreatedAt` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionEndDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStartDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionUpdatedAt` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionUserId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userCreatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userUpdatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverImage` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `format` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Book` DROP FOREIGN KEY `Book_bookUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Subscription` DROP FOREIGN KEY `Subscription_subscriptionUserId_fkey`;

-- DropIndex
DROP INDEX `User_userEmail_key` ON `User`;

-- AlterTable
ALTER TABLE `Book` DROP COLUMN `bookAuthor`,
    DROP COLUMN `bookCreatedAt`,
    DROP COLUMN `bookDescription`,
    DROP COLUMN `bookTitle`,
    DROP COLUMN `bookUpdatedAt`,
    DROP COLUMN `bookUserId`,
    ADD COLUMN `author` VARCHAR(191) NOT NULL,
    ADD COLUMN `contentUrl` VARCHAR(191) NULL,
    ADD COLUMN `coverImage` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `format` ENUM('EBOOK', 'AUDIOBOOK') NOT NULL,
    ADD COLUMN `genre` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Subscription` DROP COLUMN `subscriptionCreatedAt`,
    DROP COLUMN `subscriptionEndDate`,
    DROP COLUMN `subscriptionStartDate`,
    DROP COLUMN `subscriptionStatus`,
    DROP COLUMN `subscriptionUpdatedAt`,
    DROP COLUMN `subscriptionUserId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE', 'CANCELED') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `userCreatedAt`,
    DROP COLUMN `userEmail`,
    DROP COLUMN `userName`,
    DROP COLUMN `userPassword`,
    DROP COLUMN `userUpdatedAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `FavoriteGenre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `genre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `categoryId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `parentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chapter` (
    `chapterId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `audioUrl` VARCHAR(191) NULL,
    `bookId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`chapterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `reviewId` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `bookId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`reviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReadingHistory` (
    `historyId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `bookId` INTEGER NOT NULL,
    `progress` DOUBLE NOT NULL,
    `lastAccessed` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`historyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookCategoriesRelation` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BookCategoriesRelation_AB_unique`(`A`, `B`),
    INDEX `_BookCategoriesRelation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `FavoriteGenre` ADD CONSTRAINT `FavoriteGenre_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`categoryId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`bookId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`bookId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReadingHistory` ADD CONSTRAINT `ReadingHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReadingHistory` ADD CONSTRAINT `ReadingHistory_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`bookId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookCategoriesRelation` ADD CONSTRAINT `_BookCategoriesRelation_A_fkey` FOREIGN KEY (`A`) REFERENCES `Book`(`bookId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookCategoriesRelation` ADD CONSTRAINT `_BookCategoriesRelation_B_fkey` FOREIGN KEY (`B`) REFERENCES `Category`(`categoryId`) ON DELETE CASCADE ON UPDATE CASCADE;
