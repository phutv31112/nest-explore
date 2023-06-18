/*
  Warnings:

  - A unique constraint covering the columns `[ordinalNumber]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "ordinalNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_ordinalNumber_key" ON "Comment"("ordinalNumber");
