/*
  Warnings:

  - Added the required column `height` to the `Popup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Popup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Popup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Popup` ADD COLUMN `height` INTEGER NOT NULL,
    ADD COLUMN `position` VARCHAR(191) NOT NULL,
    ADD COLUMN `width` INTEGER NOT NULL;
