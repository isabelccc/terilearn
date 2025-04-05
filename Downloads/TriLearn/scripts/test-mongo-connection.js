const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const uri = process.env.DATABASE_URL;
  console.log('Testing connection to:', uri.replace(/:([^:@]+)@/, ':****@'));
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');
    await client.db('admin').command({ ping: 1 });
    console.log('MongoDB ping successful');
    
    const db = client.db('trilearn');
    const collections = await db.listCollections().toArray();
    console.log('Collections in trilearn database:', collections.map(c => c.name));
    
    return 'Connection test successful';
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return 'Connection test failed';
  } finally {
    await client.close();
  }
}

main()
  .then(console.log)
  .catch(console.error); 