import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await getDb();
    
    // Get all students (users with role 'user')
    const students = await db.collection('users')
      .find({ role: 'user' })
      .project({
        hashedPassword: 0 // Exclude password from response
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      status: 200,
      data: students
    });

  } catch (error) {
    console.error('Students API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
