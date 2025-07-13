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
    const dietType = searchParams.get('dietType');
    const search = searchParams.get('search');

    const db = await getDb();
    
    // Build query
    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (dietType) query.dietType = dietType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Get all diet foods
    const foods = await db.collection('dietFoods')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      data: foods,
      status: 200
    });

  } catch (error) {
    console.error('Diet Foods GET API error:', error);
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
      dietType,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      sodium,
      servingSize,
      ingredients,
      instructions,
      imageUrl,
      nutritionFacts
    } = body;

    if (!name || !description || !category) {
      return NextResponse.json(
        { error: 'Name, description, and category are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const newFood = {
      name,
      description,
      category,
      dietType: dietType || 'general',
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      fiber: fiber || 0,
      sugar: sugar || 0,
      sodium: sodium || 0,
      servingSize: servingSize || '1 serving',
      ingredients: ingredients || [],
      instructions: instructions || [],
      imageUrl: imageUrl || '',
      nutritionFacts: nutritionFacts || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.email
    };

    const result = await db.collection('dietFoods').insertOne(newFood);

    return NextResponse.json({
      message: 'Diet food created successfully',
      data: { ...newFood, _id: result.insertedId },
      status: 201
    });

  } catch (error) {
    console.error('Diet Foods POST API error:', error);
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
      dietType,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      sodium,
      servingSize,
      ingredients,
      instructions,
      imageUrl,
      nutritionFacts
    } = body;

    if (!_id || !name || !description || !category) {
      return NextResponse.json(
        { error: 'ID, name, description, and category are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.collection('dietFoods').updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          name,
          description,
          category,
          dietType,
          calories,
          protein,
          carbs,
          fat,
          fiber,
          sugar,
          sodium,
          servingSize,
          ingredients,
          instructions,
          imageUrl,
          nutritionFacts,
          updatedAt: new Date(),
          updatedBy: session.user.email
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Diet food not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Diet food updated successfully',
      status: 200
    });

  } catch (error) {
    console.error('Diet Foods PUT API error:', error);
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
        { error: 'Food ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.collection('dietFoods').deleteOne(
      { _id: new ObjectId(id) }
    );

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Diet food not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Diet food deleted successfully',
      status: 200
    });

  } catch (error) {
    console.error('Diet Foods DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
