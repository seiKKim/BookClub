-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `userEmail` VARCHAR(191) NOT NULL,
    `userPassword` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NULL,
    `userCreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userUpdatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_userEmail_key`(`userEmail`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `bookId` INTEGER NOT NULL AUTO_INCREMENT,
    `bookTitle` VARCHAR(191) NOT NULL,
    `bookAuthor` VARCHAR(191) NOT NULL,
    `bookDescription` VARCHAR(191) NULL,
    `bookUserId` INTEGER NULL,
    `bookCreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bookUpdatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`bookId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `subscriptionId` INTEGER NOT NULL AUTO_INCREMENT,
    `subscriptionUserId` INTEGER NOT NULL,
    `subscriptionStartDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subscriptionEndDate` DATETIME(3) NULL,
    `subscriptionStatus` VARCHAR(191) NOT NULL,
    `subscriptionCreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subscriptionUpdatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`subscriptionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_bookUserId_fkey` FOREIGN KEY (`bookUserId`) REFERENCES `User`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_subscriptionUserId_fkey` FOREIGN KEY (`subscriptionUserId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
