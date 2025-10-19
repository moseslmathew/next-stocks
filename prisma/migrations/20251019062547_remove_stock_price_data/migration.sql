/*
  Warnings:

  - You are about to drop the column `currentPrice` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `dayHigh` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `dayLow` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `previousClose` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `Stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "currentPrice",
DROP COLUMN "dayHigh",
DROP COLUMN "dayLow",
DROP COLUMN "previousClose",
DROP COLUMN "volume";
