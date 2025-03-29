import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { action, email, password } = await request.json();

    switch (action) {
      case 'signup': {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return NextResponse.json(
            { user: null, error: 'Email already exists' },
            { status: 400 }
          );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
          },
          select: {
            id: true,
            email: true,
            name: true,
          },
        });

        const response = NextResponse.json({ user, error: null });
        const cookieStore = await cookies();
        cookieStore.set('userId', user.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;
      }

      case 'signin': {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return NextResponse.json(
            { user: null, error: 'Invalid email or password' },
            { status: 401 }
          );
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return NextResponse.json(
            { user: null, error: 'Invalid email or password' },
            { status: 401 }
          );
        }

        const response = NextResponse.json({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          error: null,
        });

        const cookieStore = await cookies();
        cookieStore.set('userId', user.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;
      }

      case 'signout': {
        const response = NextResponse.json({ error: null });
        const cookieStore = await cookies();
        cookieStore.delete('userId');
        return response;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json({ user: null });
  }
} 