import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { ObjectId } from 'mongodb';

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
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    const db = await getDb();
    
    // Build query
    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Get all exercises
    const exercises = await db.collection('exercises')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      data: exercises,
      status: 200
    });

  } catch (error) {
    console.error('Exercises GET API error:', error);
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
    const { 
      name, 
      description, 
      category, 
      difficulty, 
      duration, 
      caloriesBurned, 
      instructions,
      equipment,
      muscleGroups,
      videoUrl,
      imageUrl
    } = body;

    if (!name || !description || !category) {
      return NextResponse.json(
        { error: 'Name, description, and category are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const newExercise = {
      name,
      description,
      category,
      difficulty: difficulty || 'beginner',
      duration: duration || 0,
      caloriesBurned: caloriesBurned || 0,
      instructions: instructions || [],
      equipment: equipment || [],
      muscleGroups: muscleGroups || [],
      videoUrl: videoUrl || '',
      imageUrl: imageUrl || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.email
    };

    const result = await db.collection('exercises').insertOne(newExercise);

    return NextResponse.json({
      message: 'Exercise created successfully',
      data: { ...newExercise, _id: result.insertedId },
      status: 201
    });

  } catch (error) {
    console.error('Exercises POST API error:', error);
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
    const { 
      _id,
      name, 
      description, 
      category, 
      difficulty, 
      duration, 
      caloriesBurned, 
      instructions,
      equipment,
      muscleGroups,
      videoUrl,
      imageUrl
    } = body;

    if (!_id || !name || !description || !category) {
      return NextResponse.json(
        { error: 'ID, name, description, and category are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.collection('exercises').updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          name,
          description,
          category,
          difficulty,
          duration,
          caloriesBurned,
          instructions,
          equipment,
          muscleGroups,
          videoUrl,
          imageUrl,
          updatedAt: new Date(),
          updatedBy: session.user.email
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Exercise updated successfully',
      status: 200
    });

  } catch (error) {
    console.error('Exercises PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Exercise ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.collection('exercises').deleteOne(
      { _id: new ObjectId(id) }
    );

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Exercise deleted successfully',
      status: 200
    });

  } catch (error) {
    console.error('Exercises DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
