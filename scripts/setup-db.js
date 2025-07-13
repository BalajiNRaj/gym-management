const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

if (!process.env.MONGODB_URI) {
  console.error('Please set MONGODB_URI in your .env.local file');
  process.exit(1);
}

async function setupDatabase() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db('gym-management');

    // Create indexes for better performance
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ accountNumber: 1 }, { unique: true });
    console.log('✅ Database indexes created!');

    // Check if admin user already exists
    const existingAdmin = await db.collection('users').findOne({ email: 'admin@gym.com' });
    
    if (existingAdmin) {
      console.log('📋 Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🆔 Account Number:', existingAdmin.accountNumber);
      console.log('👑 Role:', existingAdmin.role);
      return;
    }

    // Create admin user with enhanced structure
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = {
      name: 'Gym Admin',
      email: 'admin@gym.com',
      hashedPassword: hashedPassword,
      accountNumber: '000000000001',
      role: 'admin',
      status: 'active',
      isActive: true,
      lastActive: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(adminUser);
    
    console.log('✅ Database setup completed!');
    console.log('👤 Admin user created with ID:', result.insertedId);
    console.log('📧 Email: admin@gym.com');
    console.log('🔑 Password: admin123');
    console.log('🆔 Account Number: 000000000001');
    console.log('👑 Role: admin');
    console.log('🟢 Status: active');
    
    console.log('\n🎉 You can now log in to the system using these credentials!');
    console.log('🌐 Application URL: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    
    if (error.code === 11000) {
      console.error('🔴 Duplicate key error - User might already exist');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
    process.exit(0);
  }
}

console.log('🚀 Starting database setup...');
setupDatabase();
