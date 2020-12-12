import { Fragment } from "react";
import { Grid } from "@material-ui/core";
import logo from "../banner.png";

import TileContainer from "./TileContainer";
import SessionByDay from "./SessionByDay";
import SessionByHour from "./SessionByHour";
import CohortAnalysis from "./CohortAnalysis";
import EventsOSPie from "./EventsOSPie";
import MapAnalytics from "./MapAnalytics";
import AllEvents from "./AllEvents";
import PageVisitPie from "./PageVisitPie";

function App() {
  return (
    <Fragment>
      <img id="banner-img" src={logo} alt="Banner" />
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        spacing={2}
      >
        <TileContainer>
          <PageVisitPie />
        </TileContainer>
        <TileContainer>
          <SessionByDay />
        </TileContainer>
        <TileContainer>
          <SessionByHour />
        </TileContainer>
        <TileContainer>
          <CohortAnalysis />
        </TileContainer>
        <TileContainer>
          <EventsOSPie />
        </TileContainer>
        <TileContainer style={{ padding: 0, maxWidth: 610, height: 460 }}>
          <MapAnalytics />
        </TileContainer>
        <TileContainer>
          <AllEvents />
        </TileContainer>
      </Grid>
    </Fragment>
  );
}

export default App;
