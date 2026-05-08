-- DropForeignKey
ALTER TABLE "SandboxWallet" DROP CONSTRAINT "SandboxWallet_userId_fkey";
ALTER TABLE "SandboxPosition" DROP CONSTRAINT "SandboxPosition_userId_fkey";
ALTER TABLE "SandboxPosition" DROP CONSTRAINT "SandboxPosition_stockName_fkey";
ALTER TABLE "SandboxTransaction" DROP CONSTRAINT "SandboxTransaction_userId_fkey";
ALTER TABLE "SandboxTransaction" DROP CONSTRAINT "SandboxTransaction_stockName_fkey";
ALTER TABLE "SandboxCandleSnapshot" DROP CONSTRAINT "SandboxCandleSnapshot_userId_fkey";
ALTER TABLE "SandboxCandleSnapshot" DROP CONSTRAINT "SandboxCandleSnapshot_stockName_fkey";

-- DropTable
DROP TABLE "SandboxWallet";
DROP TABLE "SandboxPosition";
DROP TABLE "SandboxTransaction";
DROP TABLE "SandboxCandleSnapshot";

-- DropIndex
DROP INDEX "SandboxStock_name_key";

-- CreateTable
CREATE TABLE "SandboxState" (
    "userId" TEXT NOT NULL,
    "liquidite" DOUBLE PRECISION NOT NULL DEFAULT 10000,
    "positions" JSONB NOT NULL DEFAULT '[]',
    "historique" JSONB NOT NULL DEFAULT '[]',
    "candles" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SandboxState_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "SandboxState" ADD CONSTRAINT "SandboxState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
