const { MongoClient } = require('mongodb');

if (!process.env.MONGODB_URI) {
  console.error('Please set MONGODB_URI in your .env.local file');
  process.exit(1);
}

async function migrateUsers() {
  let client;
  
  try {
    console.log('🚀 Starting user migration...');
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db('gym-management');

    // Get all existing users
    const users = await db.collection('users').find({}).toArray();
    console.log(`📊 Found ${users.length} users to migrate`);

    for (const user of users) {
      const updates = {};
      
      // Migrate password field to hashedPassword
      if (user.password && !user.hashedPassword) {
        updates.hashedPassword = user.password;
        updates.$unset = { password: "" };
      }
      
      // Add role based on isAdmin field
      if (typeof user.isAdmin !== 'undefined' && !user.role) {
        updates.role = user.isAdmin ? 'admin' : 'user';
      }
      
      // Add missing fields
      if (!user.isActive) {
        updates.isActive = user.isAdmin || false;
      }
      
      if (!user.lastActive) {
        updates.lastActive = user.updatedAt || new Date();
      }

      // Update the user if there are changes
      if (Object.keys(updates).length > 0) {
        const { $unset, ...setUpdates } = updates;
        const updateDoc = { $set: setUpdates };
        if ($unset) {
          updateDoc.$unset = $unset;
        }
        
        await db.collection('users').updateOne(
          { _id: user._id },
          updateDoc
        );
        console.log(`✅ Migrated user: ${user.email}`);
      }
    }
    
    console.log('🎉 User migration completed successfully!');
    
    // Show updated admin user
    const adminUser = await db.collection('users').findOne({ email: 'admin@gym.com' });
    if (adminUser) {
      console.log('\n📋 Admin user details:');
      console.log('📧 Email:', adminUser.email);
      console.log('🆔 Account Number:', adminUser.accountNumber);
      console.log('👑 Role:', adminUser.role);
      console.log('🟢 Status:', adminUser.status);
      console.log('🔄 Last Active:', adminUser.lastActive);
    }
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
    process.exit(0);
  }
}

migrateUsers();
