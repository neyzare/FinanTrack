/*
  Warnings:

  - Made the column `userId` on table `Stock` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_userId_fkey";

-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
