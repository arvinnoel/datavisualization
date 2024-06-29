const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017/Datavisualization'; // Change this to your MongoDB URI

async function connectToMongoDB() {
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to MongoDB');
        return client;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err; // Re-throw the error to propagate it to the caller
    }
}

module.exports = {
    connectToMongoDB
};
