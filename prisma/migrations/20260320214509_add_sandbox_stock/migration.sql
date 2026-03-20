/*
  Warnings:

  - Added the required column `ticker` to the `CandleStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CandleStock" ADD COLUMN     "ticker" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SandboxStock" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "secteur" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "volatility" DOUBLE PRECISION NOT NULL,
    "Drift" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SandboxStock_pkey" PRIMARY KEY ("id")
);
