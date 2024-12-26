import data from '@/lib/data.json';
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        if (!data || data.length === 0) {
            console.error("No data to seed.");
            return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }

        for (const battle of data) {
            const {
                lookmaxxerAName,
                lookmaxxerAImageUrl,
                lookmaxxerBName,
                lookmaxxerBImageUrl,
                votesForA,
                votesForB,
                battleNumer,
            } = battle;

            // Validate fields
            if (!battleNumer || !lookmaxxerAName || !lookmaxxerBName) {
                console.warn("Invalid battle data, skipping:", battle);
                continue;
            }

            console.log(`Processing battle: ${battleNumer}`);

            await db.mogBattle.upsert({
                where: { battleNumer },
                update: {
                    lookmaxxerAName,
                    lookmaxxerAImageUrl,
                    lookmaxxerBName,
                    lookmaxxerBImageUrl,
                    votesForA,
                    votesForB,
                },
                create: {
                    lookmaxxerAName,
                    lookmaxxerAImageUrl,
                    lookmaxxerBName,
                    lookmaxxerBImageUrl,
                    votesForA,
                    votesForB,
                    battleNumer,
                },
            });
        }

        return NextResponse.json({ message: "Data seeded successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error seeding data:", error);
        return NextResponse.json({ error: "Failed to seed data", details: error.message }, { status: 500 });
    }
}
