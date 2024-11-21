import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GamesList = () => {
    const navigate = useNavigate();

    // Dummy Data
    const dummyGames = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        name: `Game ${index + 1}`,
        date: `2024-11-${(index % 30) + 1}`, // Spread dates across the month
        players: [
            "Alice",
            "Bob",
            "Charlie",
            "David",
            "Eve",
        ].slice(0, (index % 5) + 1), // Vary number of players per game
    }));

    const [games] = useState(dummyGames);
    const [filteredGames, setFilteredGames] = useState(dummyGames);
    const [playerFilter, setPlayerFilter] = useState("");

    // Filter games by player
    const handleFilterChange = (e) => {
        const playerName = e.target.value;
        setPlayerFilter(playerName);

        if (playerName.trim() === "") {
            setFilteredGames(games);
        } else {
            setFilteredGames(
                games.filter((game) =>
                    game.players.some((player) =>
                        player.toLowerCase().includes(playerName.toLowerCase())
                    )
                )
            );
        }
    };

    // Navigate to specific game details
    const handleGameClick = (gameId) => {
        navigate(`/allGames/${gameId}`);
    };

    return (
        <div className="games-list-container" style={{ padding: "20px",color:'white' , width: '60%', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <h1>Games List</h1>
            <div>
                <label htmlFor="playerFilter">Filter by Player: </label>
                <input
                    id="playerFilter"
                    type="text"
                    value={playerFilter}
                    onChange={handleFilterChange}
                    placeholder="Enter player name"
                />
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {filteredGames.map((game) => (
                    <li
                        key={game.id}
                        onClick={() => handleGameClick(game.id)}
                        style={{
                            padding: "10px",
                            margin: "5px 0",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        <strong>{game.name}</strong> - {game.date}
                        <br />
                        Players: {game.players.join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GamesList;
