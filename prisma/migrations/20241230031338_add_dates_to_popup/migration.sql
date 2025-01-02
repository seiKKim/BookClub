/*
  Warnings:

  - Added the required column `endDate` to the `Popup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Popup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Popup` ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;
