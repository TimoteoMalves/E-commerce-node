/*
  Warnings:

  - You are about to drop the column `clientName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `Order` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "clientName",
DROP COLUMN "isPaid",
ADD COLUMN     "clientId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."eClient" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,

    CONSTRAINT "eClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eClient_email_key" ON "public"."eClient"("email");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."eClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
