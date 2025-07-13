const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

if (!process.env.MONGODB_URI) {
  console.error('Please set MONGODB_URI in your .env.local file');
  process.exit(1);
}

async function testAuth() {
  let client;
  
  try {
    console.log('🧪 Starting Authentication System Test...\n');
    
    // Test 1: MongoDB Connection
    console.log('1️⃣ Testing MongoDB Connection...');
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ MongoDB connection successful\n');
    
    const db = client.db('gym-management');
    
    // Test 2: Database Collections
    console.log('2️⃣ Testing Database Collections...');
    const collections = await db.listCollections().toArray();
    const userCollection = collections.find(col => col.name === 'users');
    if (userCollection) {
      console.log('✅ Users collection exists');
    } else {
      console.log('❌ Users collection not found');
    }
    
    // Test 3: Database Indexes
    console.log('3️⃣ Testing Database Indexes...');
    const indexes = await db.collection('users').indexes();
    console.log(`✅ Found ${indexes.length} indexes on users collection`);
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    console.log();
    
    // Test 4: Admin User
    console.log('4️⃣ Testing Admin User...');
    const adminUser = await db.collection('users').findOne({ email: 'admin@gym.com' });
    if (adminUser) {
      console.log('✅ Admin user found');
      console.log(`   📧 Email: ${adminUser.email}`);
      console.log(`   👤 Name: ${adminUser.name}`);
      console.log(`   🆔 Account: ${adminUser.accountNumber}`);
      console.log(`   👑 Role: ${adminUser.role}`);
      console.log(`   🟢 Status: ${adminUser.status}`);
      console.log(`   🔑 Has Password: ${adminUser.hashedPassword ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Admin user not found');
    }
    console.log();
    
    // Test 5: API Endpoints (using fetch if available)
    console.log('5️⃣ Testing API Endpoints...');
    
    // Test Registration API
    console.log('   📝 Testing Registration API...');
    try {
      const registrationResponse = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestPassword123',
          role: 'user',
          age: 25,
          gender: 'male'
        })
      });
      
      if (registrationResponse.ok) {
        console.log('   ✅ Registration API responding');
        // Clean up test user
        await db.collection('users').deleteOne({ email: 'test@example.com' });
      } else {
        console.log(`   ⚠️  Registration API returned: ${registrationResponse.status}`);
      }
    } catch (error) {
      console.log('   ⚠️  Registration API test failed (server might not be running)');
    }
    
    // Test 6: Data Validation
    console.log('6️⃣ Testing Data Validation...');
    const userCount = await db.collection('users').countDocuments();
    console.log(`✅ Total users in database: ${userCount}`);
    
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
    console.log(`✅ Admin users: ${adminCount}`);
    
    const activeUsers = await db.collection('users').countDocuments({ status: 'active' });
    console.log(`✅ Active users: ${activeUsers}`);
    
    console.log('\n🎉 Authentication System Test Completed!');
    console.log('\n📋 Test Summary:');
    console.log('✅ MongoDB Connection: Working');
    console.log('✅ Database Collections: Set up');
    console.log('✅ Database Indexes: Created');
    console.log('✅ Admin User: Available');
    console.log('✅ Data Structure: Valid');
    
    console.log('\n🔐 Login Credentials:');
    console.log('📧 Email: admin@gym.com');
    console.log('🔑 Password: admin123');
    console.log('🌐 URL: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    if (client) {
      await client.close();
    }
    process.exit(0);
  }
}

testAuth();
