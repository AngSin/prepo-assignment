-- CreateTable
CREATE TABLE "Transfer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "transactionHash" VARCHAR(66) NOT NULL,
    "from" VARCHAR(42) NOT NULL,
    "to" VARCHAR(42) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "valueInETH" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transfer_transactionHash_idx" ON "Transfer"("transactionHash");

-- CreateIndex
CREATE INDEX "Transfer_from_idx" ON "Transfer"("from");

-- CreateIndex
CREATE INDEX "Transfer_to_idx" ON "Transfer"("to");

-- CreateIndex
CREATE INDEX "Transfer_blockNumber_idx" ON "Transfer"("blockNumber");
