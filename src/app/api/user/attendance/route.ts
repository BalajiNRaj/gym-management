import { NextRequest, NextResponse } from 'next/server';
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
    
    // Get attendance records for the current user (member)
    const attendances = await db.collection('attendance')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find({ memberId: new ObjectId((session.user as any).id) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      data: attendances,
      status: 200
    });

  } catch (error) {
    console.error('User Attendance API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { attendanceId, isPresent } = await request.json();

    if (!attendanceId) {
      return NextResponse.json(
        { error: 'Attendance ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Update attendance record for the current user
    const result = await db.collection('attendance').updateOne(
      { 
        _id: new ObjectId(attendanceId),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        memberId: new ObjectId((session.user as any).id)
      },
      { 
        $set: { 
          isPresent: isPresent !== undefined ? isPresent : true,
          markedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Attendance record not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Attendance marked successfully',
      status: 200
    });

  } catch (error) {
    console.error('User Attendance PATCH API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
