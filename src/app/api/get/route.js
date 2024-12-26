import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
// import type { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req, res) {
    try {
        const battles = await db.mogBattle.findMany();
        return NextResponse.json(battles, { status: 200 });
    } catch (error) {
        console.error("Error fetching battles:", error);
        return NextResponse.json({ error: "Failed to fetch battles", details: error.message }, { status: 500 });
    } finally {
        await db.$disconnect();
    }
}