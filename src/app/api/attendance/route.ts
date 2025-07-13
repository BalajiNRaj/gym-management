import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const userId = searchParams.get('userId');

    const db = await getDb();
    
    if (userId) {
      // Get attendance for specific user
      const userAttendance = await db.collection('attendance')
        .find({ userId, date: { $gte: date } })
        .sort({ date: -1 })
        .limit(30)
        .toArray();

      return NextResponse.json({
        data: userAttendance,
        status: 200
      });
    }

    // Get all attendance records for the date with user information
    const attendances = await db.collection('attendance')
      .aggregate([
        {
          $match: { date }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            'user.hashedPassword': 0
          }
        },
        {
          $sort: { 'user.name': 1 }
        }
      ])
      .toArray();

    // Get all users to show who's missing
    const allUsers = await db.collection('users')
      .find({ role: { $in: ['user', 'trainer'] } })
      .project({ name: 1, email: 1, role: 1, accountNumber: 1 })
      .toArray();

    // Create complete attendance list
    const completeAttendance = allUsers.map(user => {
      const record = attendances.find(a => a.userId === user._id.toString());
      return {
        userId: user._id.toString(),
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        accountNumber: user.accountNumber,
        date,
        checkIn: record?.checkIn || '',
        checkOut: record?.checkOut || '',
        status: record?.status || 'absent',
        notes: record?.notes || '',
        isPresent: record?.status === 'present',
        hoursWorked: record?.hoursWorked || 0
      };
    });

    return NextResponse.json({
      data: completeAttendance,
      date,
      status: 200
    });

  } catch (error) {
    console.error('Attendance GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, date, checkIn, checkOut, status, notes } = body;

    if (!userId || !date || !status) {
      return NextResponse.json(
        { error: 'User ID, date, and status are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Calculate hours worked if both checkIn and checkOut are provided
    let hoursWorked = 0;
    if (checkIn && checkOut) {
      const checkInTime = new Date(`${date}T${checkIn}`);
      const checkOutTime = new Date(`${date}T${checkOut}`);
      hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    }

    // Update or create attendance record
    const result = await db.collection('attendance').updateOne(
      { userId, date },
      {
        $set: {
          userId,
          date,
          checkIn: checkIn || '',
          checkOut: checkOut || '',
          status,
          notes: notes || '',
          hoursWorked,
          updatedAt: new Date(),
          updatedBy: session.user.email
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Attendance updated successfully',
      status: 200,
      modified: result.modifiedCount > 0,
      upserted: result.upsertedCount > 0
    });

  } catch (error) {
    console.error('Attendance POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { attendanceRecords } = body;

    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return NextResponse.json(
        { error: 'Attendance records array is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const bulkOps = attendanceRecords.map(record => ({
      updateOne: {
        filter: { userId: record.userId, date: record.date },
        update: {
          $set: {
            ...record,
            updatedAt: new Date(),
            updatedBy: session.user?.email || 'unknown'
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        upsert: true
      }
    }));

    const result = await db.collection('attendance').bulkWrite(bulkOps);

    return NextResponse.json({
      message: 'Bulk attendance update successful',
      status: 200,
      modified: result.modifiedCount,
      upserted: result.upsertedCount
    });

  } catch (error) {
    console.error('Attendance PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
