/*
  Warnings:

  - A unique constraint covering the columns `[battleNumer]` on the table `MogBattle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MogBattle_battleNumer_key" ON "MogBattle"("battleNumer");
