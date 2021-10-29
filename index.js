const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qzuhl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

//root of server
app.get('/', (req, res) => {
    res.send('TravelBD server is running.')
})

app.listen(port, () => {
    console.log('TravelBD server is running at port', port)
})