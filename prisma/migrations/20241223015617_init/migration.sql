-- CreateTable
CREATE TABLE "MogBattle" (
    "id" SERIAL NOT NULL,
    "lookmaxxerAName" TEXT NOT NULL,
    "lookmaxxerAImageUrl" TEXT NOT NULL,
    "lookmaxxerBName" TEXT NOT NULL,
    "lookmaxxerBImageUrl" TEXT NOT NULL,
    "votesForA" INTEGER NOT NULL DEFAULT 0,
    "votesForB" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MogBattle_pkey" PRIMARY KEY ("id")
);
