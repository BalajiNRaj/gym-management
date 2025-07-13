import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Check if user exists
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate reset token
    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
    const resetToken = {
      userId: user._id.toString(),
      token,
      createdAt: new Date(),
      resetAt: null
    };

    // Store reset token in database
    await db.collection('passwordResetTokens').insertOne(resetToken);

    // In a real application, you would send an email here
    // For now, we'll just return a success message
    console.log(`Password reset link: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/password-reset?token=${token}`);

    return NextResponse.json(
      { message: 'Password reset email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
