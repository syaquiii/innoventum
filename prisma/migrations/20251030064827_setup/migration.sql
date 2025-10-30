/*
  Warnings:

  - You are about to alter the column `tanggal_mulai` on the `enrollment` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `tanggal_selesai` on the `enrollment` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `tanggal_dibuat` on the `komentar` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `enrollment` MODIFY `tanggal_mulai` TIMESTAMP NOT NULL,
    MODIFY `tanggal_selesai` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `komentar` MODIFY `tanggal_dibuat` TIMESTAMP NOT NULL;
