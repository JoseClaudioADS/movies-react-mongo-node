import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Categories from "./components/categories/Categories";
import Movies from "./components/movies/Movies";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <span className="navbar-brand">My Movies Lib</span>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories">
                Categories
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <Switch>
        <Route path="/categories">
          <Categories></Categories>
        </Route>
        <Route path="/" exact>
          <Movies></Movies>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
