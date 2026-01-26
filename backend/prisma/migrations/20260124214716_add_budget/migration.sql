-- CreateTable
CREATE TABLE `MonthlyBudget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `month` VARCHAR(191) NOT NULL,
    `globalLimit` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MonthlyBudget_month_key`(`month`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryBudget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `monthlyBudgetId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `limit` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `CategoryBudget_monthlyBudgetId_categoryId_key`(`monthlyBudgetId`, `categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CategoryBudget` ADD CONSTRAINT `CategoryBudget_monthlyBudgetId_fkey` FOREIGN KEY (`monthlyBudgetId`) REFERENCES `MonthlyBudget`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryBudget` ADD CONSTRAINT `CategoryBudget_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
