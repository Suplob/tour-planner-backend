const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server side of tour planner askpdsas");
});

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsdfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();

    const servicesCollection = client.db("tour-planner").collection("services");
    const ordersCollection = client.db("tour-planner").collection("orders");
    // get methods
    app.get("/allServices", async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.json(result);
    });
    app.get("/singleService/:id", async (req, res) => {
      const result = await servicesCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });
    app.get("/userOrder/:email", async (req, res) => {
      const result = await ordersCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.json(result);
    });
    app.get("/allOrder", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.json(result);
    });

    //post methods
    app.post("/orderItem", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.json(result);
    });

    //delete methods
    app.delete("/deleteUserOrder/:id", async (req, res) => {
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });
  } catch {
    // await client.close;
  }
}
run().catch(console.dir);

app.listen(process.env.PORT || 5000, () => {});
