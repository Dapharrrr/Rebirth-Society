import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from 'next/server';

const Prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    
    
    try {
        const { email, name, firstName, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required'}, { status: 400});
        }

        const user = await Prisma.user.create({
            data: {
                email,
                name,
                firstName,
                password
            },
        });
        return NextResponse.json(user, { status: 201});
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error'}, { status: 500});
    }
}
