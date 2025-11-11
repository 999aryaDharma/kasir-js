-- DropForeignKey
ALTER TABLE "public"."TransactionItem" DROP CONSTRAINT "TransactionItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TransactionItem" DROP CONSTRAINT "TransactionItem_transactionId_fkey";

-- CreateIndex
CREATE INDEX "Product_categoryId_isDeleted_name_idx" ON "public"."Product"("categoryId", "isDeleted", "name");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "public"."Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "TransactionItem_createdAt_transactionId_productId_idx" ON "public"."TransactionItem"("createdAt", "transactionId", "productId");

-- AddForeignKey
ALTER TABLE "public"."TransactionItem" ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionItem" ADD CONSTRAINT "TransactionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
