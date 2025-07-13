import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { password, confirmPassword, token } = await request.json();

    if (!password || !confirmPassword || !token) {
      return NextResponse.json(
        { error: 'Missing password, confirmPassword or token' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Find and validate reset token
    const passwordResetToken = await db.collection('passwordResetTokens').findOne({
      token,
      createdAt: {
        $gt: new Date(Date.now() - 30 * 60 * 1000) // Token valid for 30 minutes
      },
      resetAt: null
    });

    if (!passwordResetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.collection('users').findOne({
      _id: new ObjectId(passwordResetToken.userId)
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await db.collection('users').updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { password: hashedPassword } }
    );

    // Mark token as used
    await db.collection('passwordResetTokens').updateOne(
      { _id: passwordResetToken._id },
      { $set: { resetAt: new Date() } }
    );

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
