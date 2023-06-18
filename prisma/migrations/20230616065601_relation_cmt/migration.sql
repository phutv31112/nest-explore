/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "Comment_id_key";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");
