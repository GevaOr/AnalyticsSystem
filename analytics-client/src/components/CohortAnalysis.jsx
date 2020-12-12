import { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import axios from "axios";

const Color = require("color");

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
    axios
      .get("http://localhost:5000/cohortAnalysis")
      .then((response) => {
        let resData = response.data.map((ret) => {
          return {
            startDate: new Date(ret.startDate),
            endDate: new Date(ret.endDate),
            newUsers: ret.newUsers,
            retention: ret.retention,
          };
        });
        setData(resData);
        setAvgData(getAvg(resData));
        setTotalUsers(getTotalUsers(resData));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let lightBlue = Color.rgb(150, 200, 255);

  return (
    <TableContainer component={Paper} className="cohort-table">
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell />
            {data.length > 0 &&
              data[0].retention.map((_, i) => {
                return (
                  <TableCell align="center" style={{ fontSize: "0.7em" }}>
                    Week {i}
                  </TableCell>
                );
              })}
          </TableRow>
        </TableHead>
        <TableBody>
          {avgData.length > 0 && (
            <TableRow>
              <TableCell align="center">
                <Typography variant="body2">All users</Typography>
                <Typography variant="caption">{totalUsers} users</Typography>
              </TableCell>
              {avgData.map((percent) => {
                return (
                  <TableCell>
                    <Typography variant="body2">
                      {percent.toFixed(2)}%
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          )}
          {data.length > 0 &&
            data.map((week) => {
              return (
                <TableRow>
                  <TableCell component="th" scope="row" align="left">
                    <Typography variant="body2">
                      {week.startDate.toDateString()} -{" "}
                      {week.endDate.toDateString()}
                    </Typography>
                    <Typography variant="caption">
                      {week.newUsers} users
                    </Typography>
                  </TableCell>
                  {week.retention.map((percent) => {
                    return (
                      <TableCell
                        align="center"
                        style={{
                          backgroundColor: lightBlue
                            .darken(percent / 200)
                            .hex(),
                        }}
                      >
                        <Typography variant="body2">
                          {percent ? percent.toFixed(2) : 0}%
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CohortAnalysis;
