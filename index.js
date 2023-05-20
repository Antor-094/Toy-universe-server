const express = require('express')
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@phero.lyjn1mj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const CarToyCollection = client.db('carToyDB').collection('toysCollection');

        app.post('/allToys', async (req, res) => {
            const newCar = req.body;
            // console.log(newCar);
            const result = await CarToyCollection.insertOne(newCar);
            res.send(result);
        })

        app.get('/allToys', async (req, res) => {
            const cursor = CarToyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const result = await CarToyCollection.findOne(query)

            res.send(result)
        })
        app.get('/allToy', async (req, res) => {
            let query = {};
        
            if (req.query?.email) {
                query = {
                    email: req.query.email
                };
            }
        
            let sortQuery = {};
        
            if (req.query?.sortingOrder) {
                const sortingOrder = req.query.sortingOrder;
                const sortField = sortingOrder === "descending" ? -1 : 1;
                sortQuery = {
                    price: sortField
                };
            }
        
            const cursor = CarToyCollection.find(query).sort(sortQuery); // Apply sorting to the query
            const result = await cursor.toArray();
        
            res.send(result);
        });
        

        app.put('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
        //     const options = {

        //   // Include only the specific data
        //   projection: { quantity: 1, price:1, description:1,_id:1},
        // };
            const updatedToy = req.body;
            console.log(updatedToy)

            const car = {
                $set: {
                    quantity: updatedToy.quantity,
                    price: updatedToy.price,
                    description: updatedToy.description
                }
            }

            const result = await CarToyCollection.updateOne(filter, car, options);
            res.send(result);
        })

        app.delete('/allToys/:id', async (req, res) => {

            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await CarToyCollection.deleteOne(query)
            res.send(result)

        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);











app.get('/', (req, res) => {
    res.send('Toy Universe is running')
});

app.listen(port, () => {
    console.log(`Toy Universe Api is running on port: ${port}`)
})