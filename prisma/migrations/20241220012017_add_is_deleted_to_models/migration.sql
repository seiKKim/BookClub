-- AlterTable
ALTER TABLE `Subscription` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;
