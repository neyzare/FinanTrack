/*
  Warnings:

  - Made the column `buyPrice` on table `Stock` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_userId_fkey";

-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "buyPrice" SET NOT NULL;

-- CreateTable
CREATE TABLE "StockSnapshot" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "ticker" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandleStock" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "Volume" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandleStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CachedQuote" (
    "ticker" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "variation" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CachedQuote_pkey" PRIMARY KEY ("ticker")
);

-- CreateIndex
CREATE INDEX "StockSnapshot_userId_snapshotDate_idx" ON "StockSnapshot"("userId", "snapshotDate");

-- CreateIndex
CREATE INDEX "StockSnapshot_ticker_snapshotDate_idx" ON "StockSnapshot"("ticker", "snapshotDate");

-- CreateIndex
CREATE INDEX "StockSnapshot_snapshotDate_idx" ON "StockSnapshot"("snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "StockSnapshot_stockId_snapshotDate_key" ON "StockSnapshot"("stockId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "CandleStock_id_key" ON "CandleStock"("id");

-- CreateIndex
CREATE INDEX "CachedQuote_updatedAt_idx" ON "CachedQuote"("updatedAt");

-- CreateIndex
CREATE INDEX "Stock_userId_idx" ON "Stock"("userId");

-- CreateIndex
CREATE INDEX "Stock_ticker_idx" ON "Stock"("ticker");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockSnapshot" ADD CONSTRAINT "StockSnapshot_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
