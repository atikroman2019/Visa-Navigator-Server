const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

module.exports = (visaCollection) => {
  
  // ----------------------
  // ADD VISA
  // ----------------------
  router.post("/", async (req, res) => {
    try {
      const visa = req.body;
      visa.createdAt = new Date();

      const result = await visaCollection.insertOne(visa);
      res.status(201).send({
        success: true,
        message: "Visa added successfully ✅",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Failed to add visa ❌" });
    }
  });

  // ----------------------
  // GET ALL VISAS
  // ----------------------
  router.get("/", async (req, res) => {
  try {
    // Get limit from query params (optional)
    const limit = parseInt(req.query.limit);

    let query = visaCollection.find().sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(limit); // <-- Apply limit
    }

    const visas = await query.toArray();

    // Send only the array, or wrap if you prefer
    res.status(200).send(visas); // <-- send ARRAY ONLY
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to fetch visas ❌" });
  }
});


  // ----------------------
  // GET LATEST 6 VISAS
  // ----------------------
  router.get("/latest", async (req, res) => {
    try {
      const latestVisas = await visaCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();

      res.status(200).send({ success: true, count: latestVisas.length, data: latestVisas });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Failed to fetch latest visas ❌" });
    }
  });

  // ----------------------
  // GET SINGLE VISA BY ID
  // ----------------------
  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const visa = await visaCollection.findOne({ _id: new ObjectId(id) });

      if (!visa) return res.status(404).send({ success: false, message: "Visa not found ❌" });

      res.status(200).send({ success: true, data: visa });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Failed to fetch visa ❌" });
    }
  });

  // ----------------------
  // UPDATE VISA BY ID
  // ----------------------
  router.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedVisa = req.body;

      const result = await visaCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedVisa }
      );

      if (result.matchedCount === 0)
        return res.status(404).send({ success: false, message: "Visa not found ❌" });

      res.status(200).send({ success: true, message: "Visa updated successfully ✅" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Failed to update visa ❌" });
    }
  });

  // ----------------------
  // DELETE VISA BY ID
  // ----------------------
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;

      const result = await visaCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0)
        return res.status(404).send({ success: false, message: "Visa not found ❌" });

      res.status(200).send({ success: true, message: "Visa deleted successfully ✅" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Failed to delete visa ❌" });
    }
  });

  return router;
};
