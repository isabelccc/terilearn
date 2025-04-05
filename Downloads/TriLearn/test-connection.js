const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://cxl0603:quojPownj3XFLegE@trilearn.ug5nnhx.mongodb.net/trilearn?retryWrites=true&w=majority";
// Replace the above with your new credentials if you changed them

async function run() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    
    // Try a simple operation
    const db = client.db("trilearn");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.close();
  }
}

run(); 