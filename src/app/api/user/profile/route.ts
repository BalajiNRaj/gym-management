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
    
    // Get current user profile
    const user = await db.collection('users').findOne(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { _id: new ObjectId((session.user as any).id) },
      { projection: { hashedPassword: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: user,
      status: 200
    });

  } catch (error) {
    console.error('User Profile API error:', error);
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

    const { name, age, weight, height, goal, level, image } = await request.json();

    const db = await getDb();

    const updateData: Record<string, unknown> = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (age) updateData.age = parseInt(age);
    if (weight) updateData.weight = parseFloat(weight);
    if (height) updateData.height = parseFloat(height);
    if (goal) updateData.goal = goal;
    if (level) updateData.level = level;
    if (image) updateData.image = image;

    const result = await db.collection('users').updateOne(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { _id: new ObjectId((session.user as any).id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      status: 200
    });

  } catch (error) {
    console.error('User Profile PATCH API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
