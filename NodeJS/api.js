const http = require('http');
const { connectToMongoDB } = require('./mongodb');
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:4200' // Allow requests from your frontend application
};

const server = http.createServer(async (req, res) => {
    const { url, method } = req;
    
    // Handle default endpoints
    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, World!\n');
    } else if (url === '/documents' && method === 'GET') {
        try {
            const client = await connectToMongoDB(); // Connect to MongoDB
            const database = client.db('Datavisualization');
            const collection = database.collection('jsondata');
            const documents = await collection.find({}).toArray();
            console.log('Documents:', documents);
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify(documents));
        } catch (err) {
            console.error('Error retrieving documents:', err);
            res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ error: 'Error retrieving documents' }));
        }
    } else {
        // Handle individual attribute endpoints
        const attribute = url.split('/')[1]; // Extract the attribute from the URL
        
        try {
            const client = await connectToMongoDB(); // Connect to MongoDB
            const database = client.db('Datavisualization');
            const collection = database.collection('jsondata');

            if (attribute === 'start_year' || attribute === 'end_year' || attribute === 'country' || attribute === 'region' || attribute === 'sector' || attribute === 'intensity' || attribute === 'topic' || attribute === 'source') {
                const distinctValues = await collection.distinct(attribute);
                // Filter out empty strings
                const filteredValues = distinctValues.filter(value => value !== '');
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(filteredValues));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
                res.end('Attribute not found');
            }
        } catch (err) {
            console.error(`Error retrieving ${attribute}:`, err);
            res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ error: `Error retrieving ${attribute}` }));
        }
    }
});

// Listening to port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
