-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('R', 'U') NOT NULL DEFAULT 'U';
