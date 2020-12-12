const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Event = require("./Models/Event");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://rootUSER:<password>@cluster0.luqmg.mongodb.net/<dbname>?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected.");
    // falseData(150);
  }
);

getLastDays = (numOfDays, selectedDate = new Date()) => {
  let dateMs = selectedDate.setHours(0, 0, 0, 0);
  selectedDate = new Date(dateMs);
  let dayInMonth = selectedDate.getDate();
  let pastDayMs = selectedDate.setDate(dayInMonth - numOfDays);
  return new Date(pastDayMs);
};

getLastWeeks = (numOfWeeks) => {
  let todayMs = new Date().setHours(0, 0, 0, 0);
  let today = new Date(todayMs);
  let dayInMonth = today.getDate();
  let pastWeekMs = today.setDate(dayInMonth - numOfWeeks * 7);
  return new Date(pastWeekMs);
};

randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

formatDate = (date) => {
  formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
  return formattedDate;
};

getUniqueIds = (idLen, numOfIds) => {
  let idArr = [];
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < numOfIds; i++) {
    let id = "";
    for (let j = 0; j < idLen; j++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    idArr.push(id);
  }
  return idArr;
};

falseData = (n) => {
  let sessionIds = [
    "sgaweawe",
    "weglskhns",
    "sdklwhegs",
    "segpoishg",
    "aseglkhnsdg",
  ];
  let userIds = getUniqueIds(10, 100);
  let names = ["App Launched", "Register Button Click", "Login Button Click"];
  let opSys = ["Android", "Windows", "MacOS", "iOS", "iPadOS"];
  let browsers = ["Chrome", "Firefox", "Safari"];
  let urls = ["/", "/about", "/login", "/user"];
  for (let i = 0; i < n; i++) {
    const event = new Event({
      session_id: sessionIds[Math.floor(Math.random() * sessionIds.length)],
      name: names[Math.floor(Math.random() * names.length)],
      distinct_user_id: userIds[Math.floor(Math.random() * userIds.length)],
      date: randomDate(getLastDays(7), new Date()).getTime(),
      os: opSys[Math.floor(Math.random() * opSys.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      geolocation: {
        location: {
          lat: 81 - i * 0.1,
          lng: 86 - i * 0.2,
        },
        accuracy: 1708,
      },
      url: urls[Math.floor(Math.random() * urls.length)],
    });
    event.save().then((doc) => {
      // console.log('Event added.');
    });
  }
};

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

// sessionsByDay
app.post("/sessionsByDay", (req, res) => {
  let selectedDate = new Date(new Date(req.body.date).setHours(24, 0, 0, 0));
  Event.find({ date: { $gt: selectedDate.getTime() } })
    .exec()
    .then((docs) => {
      let sessionsArr = [];
      for (let i = 7; i > 0; i--) {
        let firstDate = getLastDays(i, selectedDate);
        let lastDate = getLastDays(i - 1, selectedDate);

        let uniqueSessions = [];

        docs.forEach((e) => {
          eventDate = new Date(e.date);
          if (
            eventDate <= firstDate &&
            eventDate >= lastDate &&
            !uniqueSessions.includes(e.session_id)
          ) {
            uniqueSessions.push(e.session_id);
          }
        });
        sessionsArr.push({
          date: formatDate(firstDate),
          sessions: uniqueSessions.length,
        });
      }
      res.send(sessionsArr);
    });
});

// sessionsByHour
app.post("/sessionsByHour", (req, res) => {
  let selectedDate = new Date(new Date(req.body.date).setHours(24, 0, 0, 0));
  Event.find({ date: { $gt: selectedDate.getTime() } })
    .exec()
    .then((docs) => {
      let sessionsArr = [];
      for (let i = 24; i > 0; i--) {
        let startDate = new Date(selectedDate.getTime() - i * 60 * 60 * 1000);
        let endDate = new Date(
          selectedDate.getTime() - (i - 1) * 60 * 60 * 1000
        );

        let uniqueSessions = [];

        docs.forEach((e) => {
          eventDate = new Date(e.date);
          if (
            eventDate <= firstDate &&
            eventDate >= endDate &&
            !uniqueSessions.includes(e.session_id)
          ) {
            uniqueSessions.push(e.session_id);
          }
        });
        sessionsArr.push({
          time: `${startDate.getHours()}:00`,
          sessions: uniqueSessions.length,
        });
      }
      res.send(sessionsArr);
    });
});

// cohortAnalysis
app.get("/cohortAnalysis", (req, res) => {
  Event.find()
    .exec()
    .then((docs) => {
      let retention = [];
      for (let i = 0; i < 4; i++) {
        let currentEvents = docs.filter(
          (e) => e.date > getLastWeeks(i + 2).getTime()
        );
        let formerEvents = docs.filter(
          (e) => e.date < getLastWeeks(i + 3).getTime()
        );
        let userIds = [];
        currentEvents.forEach((currentEvent) => {
          let isNewUser = true;
          formerEvents.forEach((formerEvent) => {
            if (
              currentEvent.distinct_user_id === formerEvent.distinct_user_id
            ) {
              isNewUser = false;
            }
          });
          if (isNewUser && !userIds.includes(currentEvent.distinct_user_id)) {
            userIds.push(currentEvent.distinct_user_id);
          }
        });
        retention.unshift({
          startDate: getLastWeeks(i + 2),
          endDate: getLastWeeks(i + 1),
          newUsers: userIds.length,
          retention: getRetention(userIds, docs, i + 1),
        });
      }
      res.send(retention);
    })
    .catch((error) => {
      console.log(error);
    });
});

getRetention = (userIds, docs, numOfChecks) => {
  let retention = [100];
  for (let i = 0; i < numOfChecks; i++) {
    let currentEvents = docs.filter(
      (e) =>
        e.date > getLastWeeks(i + 1).getTime() &&
        e.date < getLastWeeks(i).getTime()
    );
    let uniqueIds = [];
    userIds.forEach((id) => {
      currentEvents.forEach((e) => {
        if (id === e.distinct_user_id && !uniqueIds.includes(id)) {
          uniqueIds.push(id);
        }
      });
    });
    retention.unshift((uniqueIds.length / userIds.length) * 100);
  }
  return retention;
};

// os pie
app.get("/OSPie", (req, res) => {
  const aggregatorOpts = [
    {
      $group: {
        _id: "$os",
        value: {
          $sum: 1,
        },
      },
    },
  ];
  Event.aggregate(aggregatorOpts)
    .exec()
    .then((docs) => {
      res.send(
        docs.map((osType) => {
          return {
            name: osType._id,
            value: osType.value,
          };
        })
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

// page views
app.get("/PageViews", (req, res) => {
  const aggregatorOpts = [
    {
      $group: {
        _id: "$url",
        value: {
          $sum: 1,
        },
      },
    },
  ];
  Event.aggregate(aggregatorOpts)
    .exec()
    .then((docs) => {
      res.send(
        docs.map((url) => {
          let route = url._id.replace("/", "");
          let count = url.value;
          if (!route) {
            route = "home";
          }
          return {
            name: route,
            value: count,
          };
        })
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

// maps
app.get("/locations", (req, res) => {
  Event.find()
    .select("geolocation.location")
    .exec()
    .then((docs) => {
      res.send(docs);
    })
    .catch((err) => {
      console.log(err);
    });
});

// search events
app.get("/events", (req, res) => {
  let page = req.query.page;
  let query = req.query.q;
  let sort = req.query.sort;
  let browser = req.query.browser;
  let perPage = 10;
  let mongoQuery;
  if (query) {
    mongoQuery = Event.find({ $text: { $search: query } });
  } else {
    mongoQuery = Event.find({});
  }
  if (browser) {
    mongoQuery.where({ browser: browser });
  }
  if (sort) {
    let sortBy = "";
    let [sortMethod, direction] = sort.split(" ");
    if (sortMethod === "date") {
      sortBy = "date";
    } else if (sortMethod == "alpha") {
      sortBy = "name";
    }
    mongoQuery.sort({ sortBy: direction });
  }
  mongoQuery
    .limit(perPage)
    .skip(perPage * page)
    .exec()
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/events", (req, res) => {
  Event.remove()
    .exec()
    .then((docs) => {
      res.send(docs);
    });
});

app.listen(5000);
