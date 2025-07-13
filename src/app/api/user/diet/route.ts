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
    
    // Get diet assignments for the current user (student)
    const diets = await db.collection('dietAssignments')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .findOne({ studentId: new ObjectId((session.user as any).id) });

    if (!diets) {
      return NextResponse.json({
        title: 'No diet found',
        subTitle: 'You have not been assigned a diet yet.',
        status: 404
      });
    }

    return NextResponse.json({
      data: diets,
      status: 200
    });

  } catch (error) {
    console.error('User Diet API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
