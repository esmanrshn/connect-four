import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GameCreateScreen from "./GameCreateScreen";
import GameScreen from "./GameScreen";
import GameHistory from "./GameHistory"; // Import the GameHistory component

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/game">
          <GameScreen />
        </Route>
        <Route path="/game-history">
          <GameHistory /> {/* Add the GameHistory component route */}
        </Route>
        <Route path="/">
          <GameCreateScreen />
        </Route>
      </Switch>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}
