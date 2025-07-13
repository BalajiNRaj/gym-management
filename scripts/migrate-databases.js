const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function migrateData() {
  let client;
  try {
    console.log('🔄 Starting database migration...');
    
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const sourceDb = client.db('gym_management');
    const targetDb = client.db('gym-management');
    
    // Get admin user from source database
    console.log('🔍 Looking for admin user in gym_management...');
    const adminUser = await sourceDb.collection('users').findOne({ email: 'admin@gym.com' });
    
    if (adminUser) {
      console.log('✅ Found admin user in source database');
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Account: ${adminUser.accountNumber}`);
      
      // Check if admin already exists in target database
      const existingAdmin = await targetDb.collection('users').findOne({ email: 'admin@gym.com' });
      
      if (!existingAdmin) {
        // Migrate admin user
        const result = await targetDb.collection('users').insertOne(adminUser);
        console.log('✅ Admin user migrated to gym-management database');
        console.log(`   Inserted with ID: ${result.insertedId}`);
      } else {
        console.log('ℹ️  Admin user already exists in gym-management database');
      }
    } else {
      console.log('❌ No admin user found in gym_management database');
    }
    
    // Create indexes in target database if they don't exist
    try {
      await targetDb.collection('users').createIndex({ email: 1 }, { unique: true });
      await targetDb.collection('users').createIndex({ accountNumber: 1 }, { unique: true });
      console.log('✅ Database indexes ensured in gym-management');
    } catch (indexError) {
      console.log('ℹ️  Indexes already exist or error creating them');
    }
    
    // Show final state
    console.log('\n📊 Final state of gym-management database:');
    const users = await targetDb.collection('users').find({}).toArray();
    console.log(`Total users: ${users.length}`);
    
    const adminUsers = users.filter(u => u.role === 'admin');
    const normalUsers = users.filter(u => u.role === 'user');
    const trainerUsers = users.filter(u => u.role === 'trainer');
    
    console.log(`   👑 Admin users: ${adminUsers.length}`);
    console.log(`   👤 Regular users: ${normalUsers.length}`);
    console.log(`   🏋️  Trainer users: ${trainerUsers.length}`);
    
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - Account: ${user.accountNumber || 'N/A'}`);
    });
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

migrateData();
