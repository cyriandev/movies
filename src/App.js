import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Home } from "./components/Home";
import { Detail } from "./components/Detail";
import { ShowDetail } from "./components/ShowDetail";
import { Shows } from "./components/Shows";

import "./App.css";

function App() {
  return (
    <Router>
      <nav className="nav">
        <div className="container">
          <ul>
            <li className="brand">
              <ion-icon name="logo-react"></ion-icon>
            </li>
            <li>
              <Link to="/">Movies</Link>
            </li>
            <li>
              <Link to="/shows">TV Shows</Link>
            </li>
            <li>
              <Link to="#">
                <ion-icon name="search-outline"></ion-icon>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/movie/:id">
          <Detail />
        </Route>
        <Route path="/shows">
          <Shows />
        </Route>
        <Route path="/show/:id">
          <ShowDetail />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
