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
    
    // Get fee records for the current user (student)
    const fees = await db.collection('fees')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find({ studentId: new ObjectId((session.user as any).id) })
      .sort({ createdAt: -1 })
      .toArray();

    // Calculate totals
    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
    const unpaidAmount = fees.filter(fee => fee.status === 'unpaid').reduce((sum, fee) => sum + fee.amount, 0);

    return NextResponse.json({
      data: fees,
      total: totalAmount,
      paid: paidAmount,
      unpaid: unpaidAmount,
      status: 200
    });

  } catch (error) {
    console.error('User Fees API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
