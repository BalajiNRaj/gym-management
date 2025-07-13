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
    
    // Get notifications for the current user
    const notifications = await db.collection('notifications')
      .find({ 
        $or: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { userId: new ObjectId((session.user as any).id) },
          { userEmail: session.user.email }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      data: notifications,
      status: 200
    });

  } catch (error) {
    console.error('Notifications GET API error:', error);
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

    const { userId, userEmail, type, notification_text, pathName } = await request.json();

    if (!notification_text) {
      return NextResponse.json(
        { error: 'Notification text is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    let targetUserId = null;
    let targetUserEmail = null;

    // If userId is provided, get user details
    if (userId) {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (user) {
        targetUserId = user._id;
        targetUserEmail = user.email;
      }
    } else if (userEmail) {
      const user = await db.collection('users').findOne({ email: userEmail });
      if (user) {
        targetUserId = user._id;
        targetUserEmail = user.email;
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Valid user ID or email is required' },
        { status: 400 }
      );
    }

    // Create notification
    const notification = {
      userId: targetUserId,
      userEmail: targetUserEmail,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      senderId: new ObjectId((session.user as any).id),
      type: type || 'general',
      notification_text,
      pathName: pathName || '/',
      read: false,
      createdAt: new Date()
    };

    const result = await db.collection('notifications').insertOne(notification);

    return NextResponse.json({
      message: 'Notification sent successfully',
      notification: { ...notification, _id: result.insertedId },
      status: 201
    });

  } catch (error) {
    console.error('Notifications POST API error:', error);
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

    const { notificationId, read } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.collection('notifications').updateOne(
      { 
        _id: new ObjectId(notificationId),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userId: new ObjectId((session.user as any).id)
      },
      { 
        $set: { 
          read: read !== undefined ? read : true,
          readAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Notification not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Notification updated successfully',
      status: 200
    });

  } catch (error) {
    console.error('Notifications PATCH API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
