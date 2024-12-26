/*
  Warnings:

  - Added the required column `battleNumer` to the `MogBattle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MogBattle" ADD COLUMN     "battleNumer" INTEGER NOT NULL;
