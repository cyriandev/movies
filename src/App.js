import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Detail } from "./components/Detail";
import { Shows } from "./components/Shows";
import Landing from './components/Landing';
import Tv from './components/Tv';
import Nav from './components/Nav';
import Search from './components/Search'

import MoviesState from './context/movies/MoviesState';

import "./App.css";

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
      <Router>
        <>
          <Nav />
          <Search />
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
            <Route path="/movie/:id">
              <Detail />
            </Route>
            <Route path="/shows">
              <Shows />
            </Route>
          </Switch>
        </>
      </Router>
    </MoviesState>
  );
}

export default App;
