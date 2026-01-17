const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send({ message: "Unauthorized access ❌" });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access ❌" });
    }

    req.decoded = decoded;
    next();
  });
};


// middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
//Create tokens
const jwt = require("jsonwebtoken");

app.post("/jwt", (req, res) => {
  const user = req.body; // { email }
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.send({ token });
});


async function run() {
  try {
    await client.connect();

    const database = client.db(process.env.DB_NAME);

    // Collections
    const visaCollection = database.collection("visas");
    const applicationCollection = database.collection("applications");

    // Routes
    const visaRoutes = require("./routes/visa.routes");
    const applicationRoutes = require("./routes/application.routes");

    // Register routes
    app.use("/visas", visaRoutes(visaCollection));
    app.use("/applications", verifyJWT, applicationRoutes(applicationCollection));


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
