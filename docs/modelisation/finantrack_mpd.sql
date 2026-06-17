-- FinanTrack - MPD (PostgreSQL)

CREATE TABLE "User" (
    "id"         TEXT          NOT NULL,
    "email"      TEXT          NOT NULL,
    "password"   TEXT          NOT NULL,
    "name"       TEXT          NOT NULL,
    "createdAt"  TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3)  NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Stock" (
    "id"         SERIAL            NOT NULL,
    "ticker"     TEXT              NOT NULL,
    "name"       TEXT,
    "quantity"   INTEGER           NOT NULL DEFAULT 0,
    "buyPrice"   DOUBLE PRECISION  NOT NULL,
    "userId"     TEXT              NOT NULL,
    "createdAt"  TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3)      NOT NULL,
    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StockSnapshot" (
    "id"            SERIAL            NOT NULL,
    "stockId"       INTEGER           NOT NULL,
    "ticker"        TEXT              NOT NULL,
    "userId"        TEXT              NOT NULL,
    "price"         DOUBLE PRECISION  NOT NULL,
    "quantity"      INTEGER           NOT NULL,
    "totalValue"    DOUBLE PRECISION  NOT NULL,
    "snapshotDate"  TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt"     TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CandleStock" (
    "id"      SERIAL            NOT NULL,
    "name"    TEXT              NOT NULL,
    "ticker"  TEXT              NOT NULL,
    "open"    DOUBLE PRECISION  NOT NULL,
    "high"    DOUBLE PRECISION  NOT NULL,
    "low"     DOUBLE PRECISION  NOT NULL,
    "close"   DOUBLE PRECISION  NOT NULL,
    "Volume"  INTEGER           NOT NULL,
    "date"    TIMESTAMP(3)      NOT NULL,
    CONSTRAINT "CandleStock_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CachedQuote" (
    "ticker"     TEXT              NOT NULL,
    "price"      DOUBLE PRECISION  NOT NULL,
    "variation"  DOUBLE PRECISION,
    "updatedAt"  TIMESTAMP(3)      NOT NULL,
    CONSTRAINT "CachedQuote_pkey" PRIMARY KEY ("ticker")
);

CREATE TABLE "SandboxStock" (
    "id"       SERIAL            NOT NULL,
    "name"     TEXT              NOT NULL,
    "secteur"  TEXT              NOT NULL,
    "price"    DOUBLE PRECISION  NOT NULL,
    CONSTRAINT "SandboxStock_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SandboxState" (
    "userId"      TEXT              NOT NULL,
    "liquidite"   DOUBLE PRECISION  NOT NULL DEFAULT 10000,
    "positions"   JSONB             NOT NULL DEFAULT '[]',
    "historique"  JSONB             NOT NULL DEFAULT '[]',
    "candles"     JSONB             NOT NULL DEFAULT '{}',
    "updatedAt"   TIMESTAMP(3)      NOT NULL,
    CONSTRAINT "SandboxState_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "PasswordResetToken" (
    "id"         TEXT          NOT NULL,
    "userId"     TEXT          NOT NULL,
    "tokenHash"  TEXT          NOT NULL,
    "expiresAt"  TIMESTAMP(3)  NOT NULL,
    "usedAt"     TIMESTAMP(3),
    "createdAt"  TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- unicité
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");
CREATE UNIQUE INDEX "Stock_userId_ticker_key" ON "Stock" ("userId", "ticker");
CREATE UNIQUE INDEX "StockSnapshot_stockId_snapshotDate_key" ON "StockSnapshot" ("stockId", "snapshotDate");
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken" ("tokenHash");

-- index
CREATE INDEX "Stock_userId_idx" ON "Stock" ("userId");
CREATE INDEX "Stock_ticker_idx" ON "Stock" ("ticker");
CREATE INDEX "StockSnapshot_userId_snapshotDate_idx" ON "StockSnapshot" ("userId", "snapshotDate");
CREATE INDEX "StockSnapshot_ticker_snapshotDate_idx" ON "StockSnapshot" ("ticker", "snapshotDate");
CREATE INDEX "StockSnapshot_snapshotDate_idx" ON "StockSnapshot" ("snapshotDate");
CREATE INDEX "CachedQuote_updatedAt_idx" ON "CachedQuote" ("updatedAt");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken" ("userId");
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken" ("expiresAt");

-- clés étrangères
ALTER TABLE "Stock"
    ADD CONSTRAINT "Stock_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StockSnapshot"
    ADD CONSTRAINT "StockSnapshot_stockId_fkey" FOREIGN KEY ("stockId")
    REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SandboxState"
    ADD CONSTRAINT "SandboxState_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
