import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Detail } from "./components/Detail";
import Landing from './components/Landing';
import Tv from './components/Tv';
import Nav from './components/Nav';
import Search from './components/Search'
import TvDetail from './components/TvDetail';

import MoviesState from './context/movies/MoviesState';
import TvState from './context/tv/TvState';

import "./App.css";
import Footer from "./components/Footer";

function App() {

  const [connection, setConnection] = useState(true)

  useEffect(() => {

    window.addEventListener("offline", (event) => {
      setConnection(false);
    });

    window.addEventListener("online", (event) => {
      setConnection(true);
    });

  }, [])


  if (!connection) {
    return (<div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center">
        <h1 className="text-light">You're Offline</h1>
        <p className="text-muted">Check you network connection, and reload the page</p>
      </div>
    </div>)
  }

  return (
    <MoviesState>
      <TvState>
        <Router>
          <>
            <Nav />
            <Switch>

              <Route exact path="/">
                <Landing />
              </Route>
              <Route path="/movies">
                <Landing />
              </Route>
              <Route exact path="/tv">
                <Tv />
              </Route>
              <Route path="/movie/:id/:title">
                <Detail />
              </Route>
              <Route path="/tv/:id/:title">
                <TvDetail />
              </Route>
              <Route path="/search">
                <Search />
              </Route>
            </Switch>

            <Footer />
          </>
        </Router>
      </TvState>
    </MoviesState>
  );
}

export default App;
