import React from "react";
import Video from "../nothing/Video";
import { Reg } from "../Screens/Register";
import { Log } from "../Screens/LogIn";
import About from "../Screens/About";
import { ScoreBoard } from "../nothing/ScoreBoard";
import { GameStats } from "../Screens/Statistics/GameStats";
import { Nav } from "../Components/NavBar";
import { ErrorRoute } from "./ErrorRoute";
import { StartGame } from "../Screens/StartGame";
import { Stats } from "../Screens/Statistics/Stats";
import AllGames from "../Screens/AllGames";
import "./Screen.css";
import AddGame from "../Screens/AddGame";

export const SCREEN_TYPE = Object.freeze({
  MAIN: 0,
  LOGIN: 1,
  REGISTER: 2,
  ABOUT: 3,
  START: 4,
  SCORE: 5,
  STATISTICS: 6,
  ERROR: 7,
  ALL_GAMES: 8,
  GAME_STATS: 9,
  ADD_GAME: 10,
});

export function Screen({ screenType, gameId }) {
  return (
    <div className="screen-container">
      <div className="nav-bar">
        <Nav />
      </div>
      <div className="screen-content">
        {screenType === SCREEN_TYPE.MAIN && <Video />}
        {screenType === SCREEN_TYPE.LOGIN && <Log />}
        {screenType === SCREEN_TYPE.REGISTER && <Reg />}
        {screenType === SCREEN_TYPE.ABOUT && <About />}
        {screenType === SCREEN_TYPE.SCORE && <ScoreBoard />}
        {screenType === SCREEN_TYPE.START && <StartGame />}
        {screenType === SCREEN_TYPE.STATISTICS && <Stats />}
        {screenType === SCREEN_TYPE.ERROR && <ErrorRoute />}
        {screenType === SCREEN_TYPE.ALL_GAMES && <AllGames />}
        {screenType === SCREEN_TYPE.ADD_GAME && <AddGame />}
        {screenType === SCREEN_TYPE.GAME_STATS && <GameStats gameId={gameId} />}
      </div>
    </div>
  );
}
