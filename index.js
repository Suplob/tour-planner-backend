const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server side of tour planner");
});

async function run() {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsdfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();

    const orderCollection = client.db("tour-planner").collection("orders");

    app.get("/allServices", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.json(result);
    });
  } catch {
    // await client.close;
  }
}
run().catch(console.dir);

app.listen(process.env.PORT || 5000, () => {});
