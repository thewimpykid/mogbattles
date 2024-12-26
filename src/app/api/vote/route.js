import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
   try {
       const { searchParams } = new URL(req.url);
       const battleNumer = searchParams.get("battleNumer");
       const voteType = searchParams.get("voteType"); // Get the vote type (A or B)

       // Validate parameters
       if (!battleNumer || !voteType) {
           return NextResponse.json({ error: "Missing battle number or vote type" }, { status: 400 });
       }

       if (voteType !== "A" && voteType !== "B") {
           return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
       }

       // Fetch the battle
       const battle = await db.mogBattle.findUnique({
           where: { battleNumer: parseInt(battleNumer) }, // Ensure battleNumer is an integer
       });

       if (!battle) {
           return NextResponse.json({ error: "Battle not found" }, { status: 404 });
       }

       // Increment the appropriate vote
       const updatedBattle = await db.mogBattle.update({
           where: { battleNumer: parseInt(battleNumer) },
           data: {
               votesForA: voteType === "A" ? battle.votesForA + 1 : battle.votesForA,
               votesForB: voteType === "B" ? battle.votesForB + 1 : battle.votesForB,
           },
       });

       // Fetch all updated battles to write to JSON
       const allBattles = await db.mogBattle.findMany();

       // Write updated battles to a JSON file
       const filePath = path.join(process.cwd(), 'src', 'lib', 'data.json');// Adjust the path as needed
       fs.writeFileSync(filePath, JSON.stringify(allBattles, null, 2), 'utf-8');

       return NextResponse.json({ message: "Vote updated and JSON regenerated", updatedBattle }, { status: 200 });

   } catch (error) {   
       console.error("Error updating votes:", error);
       return NextResponse.json({ error: "Failed to update votes", details: error.message }, { status: 500 });
   } finally {
       await db.$disconnect();
   }
}
