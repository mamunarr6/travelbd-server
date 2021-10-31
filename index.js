const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();
const ObjectId = require('mongodb').ObjectId;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qzuhl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelBd');
        const tourCollection = database.collection('tour');
        const ordersCollection = database.collection('orders')

        /* ==========================
              tour api
      ============================ */
        //get all tour
        app.get('/tour', async (req, res) => {
            const result = await tourCollection.find({}).toArray();
            res.send(result)
        })

        //get signle tour
        app.get('/tour/:id', async (req, res) => {
            const id = req.params.id;
            const result = await tourCollection.findOne({ _id: ObjectId(id) });
            res.send(result)
        })

        //add a new tour
        app.post('/addTour', async (req, res) => {
            console.log(req.body)
            const result = await tourCollection.insertOne(req.body);
            res.send(result);
        })

        /* ==========================
                orders api
        ============================ */

        //get all orders
        app.get('/orders', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result)
        })

        //get single order
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const result = await ordersCollection.findOne({ _id: ObjectId(id) });
            res.send(result);
            console.log(req.body)
        })

        //delete single orders
        app.delete("/deleteOrder/:id", async (req, res) => {
            console.log(req.params);
            const result = await ordersCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        //place order
        app.post('/placeOrder', async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        })

        //get my orders
        app.get('/myOrders', async (req, res) => {
            const result = await ordersCollection.find({ email: { $regex: req.query.email }, }).toArray();
            res.send(result);
            console.log(result);
        })

        //update single order
        app.put('/orders/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'Confirmed'
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            console.log('updating orders', req.body)
            res.send(result)
        })

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