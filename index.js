const express = require('express');
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@phero.lyjn1mj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,

});

async function run() {
  try {



    await client.connect(error => {
      if (error) {
        console.log(error)
        return;
      }
    });

    const CarToyCollection = client.db('carToyDB').collection('toysCollection');

    app.post('/allToys', async (req, res) => {
      const newCar = req.body;
      const result = await CarToyCollection.insertOne(newCar);
      res.send(result);
    });

    app.get('/allToys', async (req, res) => {
      const limit = parseInt(req.query.limit) || 20;
      const cursor = CarToyCollection.find().limit(limit);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CarToyCollection.findOne(query);
      res.send(result);
    });

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

      const cursor = CarToyCollection.find(query).sort(sortQuery);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;

      const car = {
        $set: {
          quantity: updatedToy.quantity,
          price: updatedToy.price,
          description: updatedToy.description
        }
      };

      const result = await CarToyCollection.updateOne(filter, car, options);
      res.send(result);
    });

    app.delete('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CarToyCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Toy Universe is running');
});

app.listen(port, () => {
  console.log(`Toy Universe API is running on port: ${port}`);
});
