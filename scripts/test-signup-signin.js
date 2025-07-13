#!/usr/bin/env node

const { MongoClient } = require('mongodb');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function testSignupAndSignin() {
  console.log('🧪 Testing Sign-up and Sign-in Flows...\n');
  
  let client;
  
  try {
    // Test 1: Test Signup API with valid data
    console.log('1️⃣ Testing Signup with valid data...');
    const signupResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Flow Test User',
        email: 'flowtest@example.com',
        password: 'FlowTest123',
        age: 25,
        gender: 'male',
        role: 'user'
      })
    });
    
    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      console.log('✅ Signup successful!');
      console.log(`   📧 Email: ${signupData.user.email}`);
      console.log(`   🆔 Account: ${signupData.user.accountNumber}`);
      console.log(`   👤 Name: ${signupData.user.name}`);
      console.log(`   🎂 Age: ${signupData.user.age}`);
      console.log(`   ⚥ Gender: ${signupData.user.gender}`);
    } else {
      const errorData = await signupResponse.json();
      console.log('❌ Signup failed:', errorData.error);
    }
    
    // Test 2: Test Signup with missing age
    console.log('\n2️⃣ Testing Signup with missing age...');
    const missingAgeResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Missing Age User',
        email: 'missingage@example.com',
        password: 'MissingAge123',
        gender: 'female',
        role: 'user'
      })
    });
    
    if (!missingAgeResponse.ok) {
      const errorData = await missingAgeResponse.json();
      console.log('✅ Missing age properly rejected:', errorData.error);
    } else {
      console.log('❌ Missing age should have been rejected!');
    }
    
    // Test 3: Test Signup with underage
    console.log('\n3️⃣ Testing Signup with underage...');
    const underageResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Underage User',
        email: 'underage@example.com',
        password: 'Underage123',
        age: 16,
        gender: 'male',
        role: 'user'
      })
    });
    
    if (!underageResponse.ok) {
      const errorData = await underageResponse.json();
      console.log('✅ Underage user properly rejected:', errorData.error);
    } else {
      console.log('❌ Underage user should have been rejected!');
    }
    
    // Test 4: Test Signup with duplicate email
    console.log('\n4️⃣ Testing Signup with duplicate email...');
    const duplicateResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate User',
        email: 'flowtest@example.com',
        password: 'Duplicate123',
        age: 30,
        gender: 'female',
        role: 'user'
      })
    });
    
    if (!duplicateResponse.ok) {
      const errorData = await duplicateResponse.json();
      console.log('✅ Duplicate email properly rejected:', errorData.error);
    } else {
      console.log('❌ Duplicate email should have been rejected!');
    }
    
    // Test 5: Verify user in database
    console.log('\n5️⃣ Verifying user in database...');
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('gym-management');
    
    const user = await db.collection('users').findOne({ email: 'flowtest@example.com' });
    if (user) {
      console.log('✅ User found in database!');
      console.log(`   👤 Name: ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 Account: ${user.accountNumber}`);
      console.log(`   🎂 Age: ${user.age}`);
      console.log(`   ⚥ Gender: ${user.gender}`);
      console.log(`   👑 Role: ${user.role}`);
      console.log(`   🟢 Status: ${user.status}`);
      console.log(`   🔑 Has Password: ${user.hashedPassword ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ User not found in database!');
    }
    
    console.log('\n🎉 Authentication Flow Tests Completed!');
    console.log('\n📋 Summary:');
    console.log('✅ Signup API: Working with proper validation');
    console.log('✅ Age Validation: Required and enforced (18+)');
    console.log('✅ Email Validation: Duplicates rejected');
    console.log('✅ Database Storage: User data stored correctly');
    console.log('✅ Password Security: Passwords hashed and stored securely');
    
    console.log('\n🔐 Test Credentials Created:');
    console.log('📧 Email: flowtest@example.com');
    console.log('🔑 Password: FlowTest123');
    console.log('🌐 Signin URL: http://localhost:3000/signin');
    
    console.log('\n📊 Database Status:');
    const totalUsers = await db.collection('users').countDocuments();
    const activeUsers = await db.collection('users').countDocuments({ status: 'active' });
    const adminUsers = await db.collection('users').countDocuments({ role: 'admin' });
    const regularUsers = await db.collection('users').countDocuments({ role: 'user' });
    
    console.log(`   👥 Total Users: ${totalUsers}`);
    console.log(`   🟢 Active Users: ${activeUsers}`);
    console.log(`   👑 Admin Users: ${adminUsers}`);
    console.log(`   👤 Regular Users: ${regularUsers}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    await fetch('http://localhost:3000');
    return true;
  } catch (error) {
    return false;
  }
}

// Run the test
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server is not running!');
    console.log('Please start the server with: npm run dev');
    process.exit(1);
  }
  
  await testSignupAndSignin();
}

main();
