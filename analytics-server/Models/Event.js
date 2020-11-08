const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  session_id: String,
  name: String,
  distinct_user_id: String,
  date: Number,
  os: String,
  browser: String,
  geolocation: Map,
  url: String,
});

const Event = mongoose.model("Events", EventSchema);
module.exports = Event;
