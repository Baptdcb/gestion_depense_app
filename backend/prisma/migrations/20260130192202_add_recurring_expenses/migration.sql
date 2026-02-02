-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `recurringExpenseId` INTEGER NULL;

-- CreateTable
CREATE TABLE `RecurringExpense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `montant` DECIMAL(10, 2) NOT NULL,
    `description` VARCHAR(191) NULL,
    `categorieId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Expense_recurringExpenseId_idx` ON `Expense`(`recurringExpenseId`);

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_recurringExpenseId_fkey` FOREIGN KEY (`recurringExpenseId`) REFERENCES `RecurringExpense`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurringExpense` ADD CONSTRAINT `RecurringExpense_categorieId_fkey` FOREIGN KEY (`categorieId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
