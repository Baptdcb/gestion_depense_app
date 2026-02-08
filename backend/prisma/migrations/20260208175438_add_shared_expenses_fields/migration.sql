-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `isShared` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `sharePercentage` DECIMAL(5, 2) NULL;
