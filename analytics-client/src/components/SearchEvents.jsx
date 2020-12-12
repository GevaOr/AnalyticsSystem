import { useEffect, useState } from "react";
import axios from "axios";

function SearchEvents(query, pageNum, sort, browser) {
  const [events, setEvents] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setEvents([]);
  }, [query, sort, browser]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "http://localhost:5000/events",
      params: { q: query, page: pageNum, sort: sort, browser: browser },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setEvents((prevEvents) => {
          return [...prevEvents, ...res.data];
        });
        setHasMoreItems(res.data.length > 0);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.log(err);
        setError(true);
      });
    return () => cancel();
  }, [query, pageNum, sort, browser]);

  return { loading, error, events, hasMoreItems };
}

export default SearchEvents;
