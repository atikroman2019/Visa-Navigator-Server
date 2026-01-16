const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Build MongoDB URI from env
console.log("DB_CLUSTER:", process.env.DB_CLUSTER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db(process.env.DB_NAME);
    const visaCollection = database.collection("visas");
    const applicationCollection = database.collection("applications");

    // Test DB route
    app.get("/test-db", async (req, res) => {
      const count = await visaCollection.estimatedDocumentCount();
      res.send({ success: true, count });
    });

    console.log("MongoDB connected securely ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error);
  }
}

run();

// Root route
app.get("/", (req, res) => {
  res.send("Visa Navigator Server Running 🚀");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://atikroman2016_db_user:<db_password>@cluster0.w6jd5gu.mongodb.net/?appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
