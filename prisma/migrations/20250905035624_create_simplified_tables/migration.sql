-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stock" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currentPrice" DECIMAL(10,2),
    "previousClose" DECIMAL(10,2),
    "dayHigh" DECIMAL(10,2),
    "dayLow" DECIMAL(10,2),
    "volume" BIGINT,
    "lastUpdated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Watchlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "targetPrice" DECIMAL(10,2),
    "notes" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_symbol_key" ON "public"."Stock"("symbol");

-- CreateIndex
CREATE INDEX "Stock_symbol_idx" ON "public"."Stock"("symbol");

-- CreateIndex
CREATE INDEX "Watchlist_userId_idx" ON "public"."Watchlist"("userId");

-- CreateIndex
CREATE INDEX "Watchlist_stockId_idx" ON "public"."Watchlist"("stockId");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_stockId_key" ON "public"."Watchlist"("userId", "stockId");

-- AddForeignKey
ALTER TABLE "public"."Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Watchlist" ADD CONSTRAINT "Watchlist_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "public"."Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
