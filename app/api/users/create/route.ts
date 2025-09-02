import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

const userSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/\d/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
  name: z.string().trim().min(1, "Name is required").max(100),
  firstName: z.string().trim().min(1, "First name is required").max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      // collect readable validation messages
      const errors = parsed.error.issues.map(i => ({
        path: i.path.join("."),
        message: i.message,
      }));
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const { email, password, name, firstName } = parsed.data;

    // Optional: early conflict check (also handled by unique constraint)
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user; NEVER store plaintext password
    const user = await prisma.user.create({
      data: { email, name, firstName, password: passwordHash },
      select: { id: true, email: true, name: true, firstName: true, createdAt: true }, // omit password
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    // Handle Prisma unique constraint (P2002) gracefully
    if (err?.code === "P2002" && err?.meta?.target?.includes("email")) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    // Log server-side as needed
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
