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
    
    // Calculate fee statistics
    const totalFees = await db.collection('fees').aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          paidAmount: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] 
            } 
          },
          unpaidAmount: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'unpaid'] }, '$amount', 0] 
            } 
          }
        }
      }
    ]).toArray();

    const stats = totalFees[0] || {
      totalAmount: 0,
      paidAmount: 0,
      unpaidAmount: 0
    };

    // Get all fees with student information
    const fees = await db.collection('fees')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $project: {
            'student.hashedPassword': 0
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray();

    return NextResponse.json({
      data: fees,
      income: stats.paidAmount,
      unpaid: stats.unpaidAmount,
      total: stats.totalAmount,
      status: 200
    });

  } catch (error) {
    console.error('Fees GET API error:', error);
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

    const { studentId, amount, description, dueDate } = await request.json();

    if (!studentId || !amount) {
      return NextResponse.json(
        { error: 'Student ID and amount are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Verify student exists
    const student = await db.collection('users').findOne({
      _id: new ObjectId(studentId),
      role: 'user'
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Create fee record
    const fee = {
      studentId: new ObjectId(studentId),
      amount: parseFloat(amount),
      description: description || 'Monthly fee',
      status: 'unpaid',
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('fees').insertOne(fee);

    // Send notification to student
    await db.collection('notifications').insertOne({
      userId: new ObjectId(studentId),
      userEmail: student.email,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      senderId: new ObjectId((session.user as any).id || 'unknown'),
      type: 'fee',
      notification_text: `New fee of $${amount} has been added to your account`,
      pathName: '/user/fees',
      read: false,
      createdAt: new Date()
    });

    return NextResponse.json({
      message: 'Fee added successfully',
      fee: { ...fee, _id: result.insertedId },
      status: 201
    });

  } catch (error) {
    console.error('Fees POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
