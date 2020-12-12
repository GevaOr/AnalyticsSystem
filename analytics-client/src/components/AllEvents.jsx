import { useState, useRef, useCallback } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

import SearchEvents from "./SearchEvents";

const loader = <CircularProgress />;

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  inputDiv: {
    display: "flex",
    flexDirection: "column",
  },
}));

function AllEvents() {
  const classes = useStyles();

  const [query, setQuery] = useState("");
  const [pageNum, setPageNum] = useState(0);

  const [sort, setSort] = useState(null);
  const [browser, setBrowser] = useState(null);

  const { loading, error, events, hasMoreItems } = SearchEvents(
    query,
    pageNum,
    sort,
    browser
  );

  const observer = useRef();
  const lastEventRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreItems) {
          setPageNum((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMoreItems]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNum(0);
  }

  function handleChangeSort(event) {
    setSort(event.target.value);
    setPageNum(0);
  }

  function handleChangeBrowser(event) {
    setBrowser(event.target.value);
    setPageNum(0);
  }

  return (
    <>
      <div className={classes.inputDiv}>
        <Typography variant="h5">Search Events:</Typography>
        <FormControl
          className={classes.formControl}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="standard-multiline-flexible"
            label="Search Event Name"
            multiline
            rowsMax={4}
            value={query}
            onChange={handleSearch}
          />
          <FormControl />
          <FormControl className={classes.formControl}>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label"
              value={sort}
              onChange={handleChangeSort}
            >
              <MenuItem value={"date desc"}>Date ⬇</MenuItem>
              <MenuItem value={"date asc"}>Date ⬆</MenuItem>
              <MenuItem value={"alpha desc"}>Name ⬇</MenuItem>
              <MenuItem value={"alpha asc"}>Name ⬆</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="browser-label">Browser</InputLabel>
            <Select
              labelId="browser-label"
              value={browser}
              onChange={handleChangeBrowser}
            >
              <MenuItem value={""}>Any Browser</MenuItem>
              <MenuItem value={"Safari"}>Safari</MenuItem>
              <MenuItem value={"Firefox"}>Firefox</MenuItem>
              <MenuItem value={"Chrome"}>Chrome</MenuItem>
            </Select>
          </FormControl>
        </FormControl>
      </div>
      <div>
        {events.map((e, i) => {
          if (events.length === i + 1) {
            return (
              <Accordion key={i} ref={lastEventRef}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    Session ID: {e.session_id}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    User ID: {e.distinct_user_id}
                    <br />
                    Event name: {e.name}
                    <br />
                    Date: {new Date(e.date).toLocaleString()}
                    <br />
                    Operating System: {e.os}
                    <br />
                    Browser: {e.browser}
                    <br />
                    Page visited: {e.url}
                    <br />
                    Location: lat: {e.geolocation.location.lat}, lng:{" "}
                    {e.geolocation.location.lng}
                    <br />
                    Location accuracy: {e.geolocation.accuracy}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          } else {
            return (
              <Accordion key={i}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    Session ID: {e.session_id}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    User ID: {e.distinct_user_id}
                    <br />
                    Event name: {e.name}
                    <br />
                    Date: {new Date(e.date).toLocaleString()}
                    <br />
                    Operating System: {e.os}
                    <br />
                    Browser: {e.browser}
                    <br />
                    Page visited: {e.url}
                    <br />
                    Location: lat: {e.geolocation.location.lat}, lng:{" "}
                    {e.geolocation.location.lng}
                    <br />
                    Location accuracy: {e.geolocation.accuracy}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          }
        })}
        <div>{loading && loader}</div>
        <div>{error && "An error occured..."}</div>
      </div>
    </>
  );
}

export default AllEvents;
