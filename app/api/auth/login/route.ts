import { NextResponse, NextRequest } from 'next/server';
import { UserService } from '@/app/api/users/service/userService';
import bcrypt from 'bcryptjs';

const userService = new UserService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const user = await userService.getUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _p, ...safeUser } = user as any;

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Login failed' }, { status: 500 });
  }
}
