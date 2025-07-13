import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      email, 
      password, 
      role = 'user',
      image = '',
      age,
      weight,
      height,
      gender,
      goal,
      level 
    } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength (following reference repo pattern)
    if (password.length < 8 || password.length > 20) {
      return NextResponse.json(
        { error: 'Password must be between 8 and 20 characters' },
        { status: 400 }
      );
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
    if (!passwordPattern.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter and one number' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'trainer', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, trainer, or user' },
        { status: 400 }
      );
    }

    // Validate additional fields for students
    if (role === 'user') {
      if (!age || age < 18) {
        return NextResponse.json(
          { error: 'Age is required and must be at least 18 for students' },
          { status: 400 }
        );
      }
      if (!gender || !['male', 'female'].includes(gender)) {
        return NextResponse.json(
          { error: 'Gender is required for students (male/female)' },
          { status: 400 }
        );
      }
    }

    const db = await getDb();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Generate account number
    const userCount = await db.collection('users').countDocuments();
    const accountNumber = (userCount + 1).toString().padStart(12, '0');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Find admin user for adminId reference
    const adminUser = await db.collection('users').findOne({ role: 'admin' });

    // Create user object
    const newUser = {
      name,
      email: email.toLowerCase(),
      hashedPassword,
      accountNumber,
      role,
      status: 'active',
      image: image || '',
      
      // Physical attributes (for students/trainers)
      ...(role === 'user' && {
        age: parseInt(age),
        weight: weight ? parseInt(weight) : undefined,
        height: height ? parseInt(height) : undefined,
        gender,
        goal: goal || 'get_fitter',
        level: level || 'beginner'
      }),
      
      // Relationships
      adminId: adminUser ? adminUser._id.toString() : null,
      trainerId: null, // Can be assigned later
      
      // Activity tracking
      isActive: false,
      lastActive: new Date(),
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    // Return user without password (hashedPassword is destructured but not used)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword: _, ...userResponse } = newUser;

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { ...userResponse, id: result.insertedId.toString() }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
