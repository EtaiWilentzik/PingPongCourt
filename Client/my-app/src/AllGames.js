import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import {GamesList} from "./Charts/GamesList";

const AllGames = () => {
    const { token } = useContext(AuthContext); // Access the token from AuthContext
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [playerFilter, setPlayerFilter] = useState("");

    useEffect(() => {
        const fetchGames = async () => {
            if (!token) {
                console.error("No token available");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/games/allGames", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Accept-Encoding": "gzip, deflate",
                    },
                });


                if (response.ok) {
                    const data = await response.json();
                    setGames(data.data); // Assuming `data` contains the games array
                    setFilteredGames(data.data);
                } else {
                    console.error("Failed to fetch games", response.status);
                }
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };

        fetchGames();
    }, [token]);

    // Filter games by player
    const handleFilterChange = (e) => {
        const playerName = e.target.value;
        setPlayerFilter(playerName);

        if (playerName.trim() === "") {
            setFilteredGames(games);
        } else {
            setFilteredGames(
                games.filter((game) =>
                    Object.values(game.playerLeft)
                        .concat(Object.values(game.playerRight))
                        .some((player) =>
                            String(player).toLowerCase().includes(playerName.toLowerCase())
                        )
                )
            );
        }
    };


    return (
        <div className="games-list-container">
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
            <GamesList list={filteredGames} />

        </div>
    );
};

export default AllGames;
