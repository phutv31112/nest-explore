/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Rate` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Rate" ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Rate_id_key" ON "Rate"("id");
