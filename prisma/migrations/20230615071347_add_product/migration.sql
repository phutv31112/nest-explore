/*
  Warnings:

  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropIndex
DROP INDEX "User_resetToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetToken",
ALTER COLUMN "hashedPassword" DROP NOT NULL;

-- DropTable
DROP TABLE "Note";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
