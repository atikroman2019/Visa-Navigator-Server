const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

module.exports = (applicationCollection) => {

  // APPLY FOR VISA
  router.post("/", async (req, res) => {
    const application = req.body;
    application.appliedDate = new Date();

    const result = await applicationCollection.insertOne(application);
    res.send({ success: true, result });
  });

  // GET MY APPLICATIONS (by email)
  router.get("/", async (req, res) => {
    const email = req.query.email;

    const applications = await applicationCollection
      .find({ applicantEmail: email })
      .toArray();

    res.send(applications);
  });

  // CANCEL APPLICATION
  router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    const result = await applicationCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send({ success: true, result });
  });

  return router;
};
