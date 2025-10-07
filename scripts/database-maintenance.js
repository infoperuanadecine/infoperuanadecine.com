// Production database maintenance
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://infoperuana-user:Df5TtUm6zrPA@infoperuana-cluster.4q69lkk.mongodb.net/?retryWrites=true&w=majority&appName=infoperuana-cluster";

async function maintainDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('moviedb');
    const collection = db.collection('movies');
    
    console.log('🔧 Database Maintenance...\n');
    
    // Remove invalid entries
    const removeInvalid = await collection.deleteMany({
      $or: [
        { title: { $exists: false } },
        { title: "" },
        { title: null }
      ]
    });
    
    console.log(`🗑️ Removed ${removeInvalid.deletedCount} invalid entries`);
    
    // Get status
    const total = await collection.countDocuments();
    const available = await collection.countDocuments({ available: { $ne: false } });
    const hidden = await collection.countDocuments({ available: false });
    
    console.log('\n📊 Database Status:');
    console.log(`   Total: ${total}`);
    console.log(`   Available: ${available}`);
    console.log(`   Hidden: ${hidden}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

maintainDatabase();