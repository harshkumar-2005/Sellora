/*
  Warnings:

  - You are about to alter the column `provider` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - Added the required column `shippingCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCountry` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingLine1` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPostalCode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingState` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `shippingCity` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingCountry` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingLine1` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingLine2` VARCHAR(191) NULL,
    ADD COLUMN `shippingName` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingPhone` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingPostalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingState` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `provider` ENUM('RAZORPAY', 'STRIPE', 'COD') NOT NULL;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `line1` VARCHAR(191) NOT NULL,
    `line2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
