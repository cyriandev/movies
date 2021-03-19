import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Detail } from "./components/Detail";
import { Shows } from "./components/Shows";
import Landing from './components/Landing';

import MoviesState from './context/movies/MoviesState';

import "./App.css";

function App() {
  return (
    <MoviesState>
      <Router>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path="/movie/:id">
            <Detail />
          </Route>
          <Route path="/shows">
            <Shows />
          </Route>
        </Switch>
      </Router>
    </MoviesState>
  );
}

export default App;
