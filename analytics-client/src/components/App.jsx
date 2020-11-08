import { Fragment } from "react";
import { Grid } from "@material-ui/core";
import SessionByDay from "./SessionByDay";

function App() {
  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item>
          <SessionByDay />
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default App;
