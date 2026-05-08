-- DropForeignKey
ALTER TABLE "SandboxState" DROP CONSTRAINT "SandboxState_userId_fkey";

-- DropTable
DROP TABLE "SandboxState";

-- CreateIndex
CREATE UNIQUE INDEX "SandboxStock_name_key" ON "SandboxStock"("name");

-- CreateTable
CREATE TABLE "SandboxWallet" (
    "userId" TEXT NOT NULL,
    "liquidite" DOUBLE PRECISION NOT NULL DEFAULT 10000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SandboxWallet_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "SandboxPosition" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "stockName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "avgBuyPrice" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SandboxPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SandboxTransaction" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "stockName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SandboxTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SandboxCandleSnapshot" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "stockName" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SandboxCandleSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SandboxPosition_userId_idx" ON "SandboxPosition"("userId");

-- CreateIndex
CREATE INDEX "SandboxPosition_stockName_idx" ON "SandboxPosition"("stockName");

-- CreateIndex
CREATE UNIQUE INDEX "SandboxPosition_userId_stockName_key" ON "SandboxPosition"("userId", "stockName");

-- CreateIndex
CREATE INDEX "SandboxTransaction_userId_timestamp_idx" ON "SandboxTransaction"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "SandboxTransaction_stockName_idx" ON "SandboxTransaction"("stockName");

-- CreateIndex
CREATE INDEX "SandboxCandleSnapshot_userId_stockName_timeframe_idx" ON "SandboxCandleSnapshot"("userId", "stockName", "timeframe");

-- CreateIndex
CREATE INDEX "SandboxCandleSnapshot_stockName_idx" ON "SandboxCandleSnapshot"("stockName");

-- CreateIndex
CREATE UNIQUE INDEX "SandboxCandleSnapshot_userId_stockName_timeframe_time_key" ON "SandboxCandleSnapshot"("userId", "stockName", "timeframe", "time");

-- AddForeignKey
ALTER TABLE "SandboxWallet" ADD CONSTRAINT "SandboxWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SandboxPosition" ADD CONSTRAINT "SandboxPosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SandboxPosition" ADD CONSTRAINT "SandboxPosition_stockName_fkey" FOREIGN KEY ("stockName") REFERENCES "SandboxStock"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SandboxTransaction" ADD CONSTRAINT "SandboxTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SandboxTransaction" ADD CONSTRAINT "SandboxTransaction_stockName_fkey" FOREIGN KEY ("stockName") REFERENCES "SandboxStock"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SandboxCandleSnapshot" ADD CONSTRAINT "SandboxCandleSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SandboxCandleSnapshot" ADD CONSTRAINT "SandboxCandleSnapshot_stockName_fkey" FOREIGN KEY ("stockName") REFERENCES "SandboxStock"("name") ON DELETE CASCADE ON UPDATE CASCADE;
