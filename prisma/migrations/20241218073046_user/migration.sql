/*
  Warnings:

  - You are about to alter the column `gender` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `phoneNumber` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE `Book` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `FAQ` ADD COLUMN `isPublic` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Inquiry` ADD COLUMN `isResolved` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Notice` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Review` MODIFY `rating` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    MODIFY `phoneNumber` VARCHAR(15) NULL;
