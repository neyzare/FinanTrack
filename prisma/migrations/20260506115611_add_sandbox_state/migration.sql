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
