import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { ObjectId } from 'mongodb';

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
    
    // Get exercise assignments for the current user (student)
    const exercises = await db.collection('exerciseAssignments')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find({ studentId: new ObjectId((session.user as any).id) })
      .sort({ createdAt: -1 })
      .toArray();

    if (exercises.length === 0) {
      return NextResponse.json({
        title: 'No exercises found',
        subTitle: 'You have not been assigned any exercises yet.',
        status: 404
      });
    }

    return NextResponse.json({
      data: exercises,
      status: 200
    });

  } catch (error) {
    console.error('User Exercise API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
