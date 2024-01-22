import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import GameCreateScreen from "./GameCreateScreen";
import GameScreen from "./GameScreen";
import GameHistory from "./GameHistory";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <Toaster />
      <RouteChangeHandler />
      <Switch>
        <Route path="/game">
          <GameScreen />
        </Route>
        <Route path="/game-history">
          <GameHistory />
        </Route>
        <Route path="/">
          <GameCreateScreen />
        </Route>
      </Switch>
    </Router>
  );
}

function RouteChangeHandler() {
  let a = true
  const history = useHistory();

  useEffect(() => {
    const gameData = localStorage.getItem("gameData");
    const data = gameData ? JSON.parse(gameData) : null;

    if (a) {
      if (!data || !isGameDataValid(data)) {
        toast.error("Lütfen oyun bilgilerini giriniz.");
        history.push("/");
        a = false
      }
    }
    // Eğer gameData yoksa veya geçerli değilse, kullanıcıyı GameCreateScreen'e yönlendir ve toast mesajını göster

  }, [history]);

  return null;
}

function isGameDataValid(data) {
  // Burada her bir alanın doluluğunu kontrol ediyoruz
  return data.username && data.gameName && data.userColor && data.computerColor;
}
