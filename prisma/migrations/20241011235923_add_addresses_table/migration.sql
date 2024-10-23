/*
  Warnings:

  - You are about to drop the `users2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `users2`;

-- CreateTable
CREATE TABLE `addressses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lineOne` VARCHAR(191) NOT NULL,
    `lineTwo` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `addressses_lineTwo_key`(`lineTwo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `addressses` ADD CONSTRAINT `addressses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
