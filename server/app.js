
require('dotenv').config();
const { MongoClient } = require('mongodb');
const express = require('express');

const app = express();
const port = 3000;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Connect to MongoDB and then start the server
client.connect()
  .then(() => {
      app.listen(port, () => {
          console.log(`Server listening at http://localhost:${port}`);
          console.log("Connected successfully to MongoDB Atlas");
      });
  })
  .catch(console.error);
  
