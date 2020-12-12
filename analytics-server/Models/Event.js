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

EventSchema.index({
  session_id: "text",
  name: "text",
  distinct_user_id: "text",
  date: "text",
  os: "text",
  browser: "text",
  geolocation: "text",
  url: "text",
});

const Event = mongoose.model("Events", EventSchema);
module.exports = Event;
