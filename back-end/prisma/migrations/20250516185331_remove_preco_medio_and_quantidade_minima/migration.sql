/*
  Warnings:

  - You are about to drop the column `preco_medio` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade_minima` on the `produtos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "produtos" DROP COLUMN "preco_medio",
DROP COLUMN "quantidade_minima";
