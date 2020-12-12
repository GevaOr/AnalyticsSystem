import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Grid } from "@material-ui/core";

const demoData = [
  {
    startDate: new Date("2020-01-22"),
    endDate: new Date("2020-01-28"),
    newUsers: 2458,
    retention: [100, 45, 25, 18, 10],
  },
  {
    startDate: new Date("2020-01-15"),
    endDate: new Date("2020-01-21"),
    newUsers: 1865,
    retention: [100, 45, 25, 18],
  },
  {
    startDate: new Date("2020-01-08"),
    endDate: new Date("2020-01-14"),
    newUsers: 988,
    retention: [100, 45, 25],
  },
  {
    startDate: new Date("2020-01-01"),
    endDate: new Date("2020-01-07"),
    newUsers: 824,
    retention: [100, 10],
  },
];

function CohortAnalysis() {
  const [data, setData] = useState([]);
  const [avgData, setAvgData] = useState([]);
  const [totalUsers, setTotalUsers] = useState();

  const getAvg = (data) => {
    let avgData = [];
    data[0].retention.forEach((_, i) => {
      let percentSum = 0;
      data.forEach((obj) => {
        if (obj.retention[i]) {
          percentSum += obj.retention[i];
        }
      });
      avgData.push(percentSum / data.length);
    });
    return avgData;
  };

  const getTotalUsers = (data) => {
    let totalUsers = 0;
    data.forEach((obj) => {
      totalUsers += obj.newUsers;
    });
    return totalUsers;
  };

  useEffect(() => {
    // ACTUAL DATA CALL
    // axios
    //   .get("http://localhost:5000/cohortAnalysis")
    //   .then((response) => {
    //     setData(response);
    //     setAvgData(getAvgPercentages(response))
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // DUMMY DATA SET
    setData(demoData);
    setAvgData(getAvg(demoData));
    setTotalUsers(getTotalUsers(demoData));
  }, []);

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        {data.length > 0 &&
          data[0].retention.map((_, i) => {
            return <Typography variant="body2">Week {i}</Typography>;
          })}
      </Grid>
      {avgData.length > 0 && (
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <Grid item>
            <Typography variant="body2">Total users</Typography>
            <Typography variant="caption">{totalUsers} new users</Typography>
          </Grid>
          {avgData.map((percent) => {
            return (
              <Grid
                item
                style={{
                  backgroundColor: "gray",
                  borderRadius: "5px",
                  margin: "3px 8px",
                  padding: "1px",
                }}
              >
                <Typography variant="body2">{percent}%</Typography>
              </Grid>
            );
          })}
        </Grid>
      )}
      {data.length > 0 &&
        data.map((week) => {
          return (
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              <Grid item>
                <Typography variant="body2">
                  {week.startDate.toDateString()} -{" "}
                  {week.endDate.toDateString()}
                </Typography>
                <Typography variant="caption">
                  {week.newUsers} new users
                </Typography>
              </Grid>
              {week.retention.map((percent) => {
                return (
                  <Grid
                    item
                    style={{
                      backgroundColor: "lightblue",
                      borderRadius: "5px",
                      margin: "3px 8px",
                      padding: "1px",
                    }}
                  >
                    <Typography style={{ textAlign: "center" }} variant="body2">
                      {percent}%
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>
          );
        })}
    </div>
  );
}

export default CohortAnalysis;
