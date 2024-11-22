import React from "react";
import { useNavigate } from "react-router-dom";
import './GamesList.css';

export function GamesList({ list, isRest = false }) {
    const navigate = useNavigate();

    const handleGameClick = (gameId) => {
        navigate(`/allGames/${gameId}`);
    };

    const handleAllGamesClick = () => {
        navigate('/allGames');
    };

    return (
        <table className="games-list-table">
            <thead>
            <tr className="games-list-header-row">
                <th className="games-list-header">Date</th>
                <th className="games-list-header">Left Player Name</th>
                <th className="games-list-header">Left Player Score</th>
                <th className="games-list-header">Right Player Score</th>
                <th className="games-list-header">Right Player Name</th>
            </tr>
            </thead>
            <tbody>
            {list.map((game) => (
                <tr
                    key={game.gameId}
                    className="games-list-row"
                    onClick={() => handleGameClick(game.gameId)}
                >
                    <td className="games-list-cell">{new Date(game.datePlayed).toLocaleString()}</td>
                    <td className="games-list-cell">{game.playerLeft.name}</td>
                    <td className="games-list-cell">{game.playerLeft.score}</td>
                    <td className="games-list-cell">{game.playerRight.score}</td>
                    <td className="games-list-cell">{game.playerRight.name}</td>
                </tr>
            ))}
            {isRest && (
                <tr
                    className="games-list-row all-games-row"
                    onClick={handleAllGamesClick}
                >
                    <td className="games-list-cell" colSpan="5">
                        To all games
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
}
