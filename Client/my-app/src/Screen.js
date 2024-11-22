import React from "react";
import Video from "./Video";
import { Reg } from "./Register";
import { Log } from "./LogIn";
import About from "./About";
import { ScoreBoard } from "./ScoreBoard";
import { GameStats } from "./GameStats";
import { Nav } from "./NavBar";
import { ErrorRoute } from "./ErrorRoute";
import { StartGame } from "./StartGame";
import { Stats } from "./Stats";
import GamesList from "./GamesList";
import "./Screen.css";

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
                {screenType === SCREEN_TYPE.ALL_GAMES && <GamesList />}
                {screenType === SCREEN_TYPE.GAME_STATS && <GameStats gameId={gameId} />}
            </div>
        </div>
    );
}
