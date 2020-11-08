const express = require("express");
const mongoose = require("mongoose");
const Event = require("./Models/Event");

const app = express();
app.use(express.json());

mongoose.connect(
  "mongodb+srv://rootUSER:rlkbL1gt4YDNybEH@cluster0.luqmg.mongodb.net/analytics?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected.");
  }
);

app.post("/event", (req, res) => {
  const event = new Event({
    session_id: req.body.session_id,
    name: req.body.name,
    distinct_user_id: req.body.distinct_user_id,
    date: req.body.date,
    os: req.body.os,
    browser: req.body.browser,
    geolocation: req.body.geolocation,
    url: req.body.url,
  });
  event.save().then(() => {
    res.send("event added.");
  });
});

app.get("/events/", (_req, res) => {
  Event.find()
    .exec()
    .then((docs) => {
      res.send(docs);
    });
});

// sessionsByHour

app.listen(5000);
