const mongoose = require('mongoose');
const uri = "mongodb+srv://admin:admin4L@cluster0.hecdl.mongodb.net/";

async function run() {
  try {
    console.log("Connecting...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected!");
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Check count
    const count = await mongoose.connection.collection('roadmaphistories').countDocuments();
    console.log("Count in roadmaphistories:", count);
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}
run();
