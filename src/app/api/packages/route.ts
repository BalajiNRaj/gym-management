import { NextRequest, NextResponse } from 'next/server';
import { PackageModel } from '@/models/Package';

export async function GET() {
  try {
    // Comment: This would fetch packages from the database
    const packages = await PackageModel.findAll();
    
    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Comment: This would create a new package in the database
    const packageItem = await PackageModel.create(body);
    
    return NextResponse.json(packageItem, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}
