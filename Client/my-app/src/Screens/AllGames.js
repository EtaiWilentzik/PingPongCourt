import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App/AuthContext";
import { GamesList } from "../Components/GamesList";
import "./AllGames.css";
import Message from "../Components/Message"; // Import the Message component

const AllGames = () => {
  const { token } = useContext(AuthContext); // Access the token from AuthContext
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [playerFilter, setPlayerFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  // Function to fetch games
  const fetchGames = async () => {
    if (!token) {
      setError("No token available");
      setIsLoading(false);
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
        setIsLoading(false); // End loading state
      } else {
        setError("Failed to fetch games");
        setIsLoading(false); // End loading state
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Network or server error while fetching games.");
      setIsLoading(false); // End loading state
    }
  };

  // Trigger fetching games when the component mounts
  useEffect(() => {
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
            .some((player) => String(player).toLowerCase().includes(playerName.toLowerCase()))
        )
      );
    }
  };

  // Handle retry logic when no data is found or there is an error
  const handleRetry = () => {
    setIsLoading(true); // Start loading state again
    setError(null); // Clear any previous error
    fetchGames(); // Retry fetching games
  };

  // Show the loading or error message if applicable
  if (isLoading) {
    return <Message content={"Please wait while fetching the data."} headline={"Loading..."} showButton={false} />;
  }

  if (error) {
    return (
      <Message
        headline={"No Data Found"}
        content={"We couldn't find your games"}
        btnText={"Retry"}
        onClick={handleRetry} // Retry the fetch on button click
      />
    );
  }

  return (
    <div className="all-games-page games-list-container center">
      <h1>Games List</h1>
      <div>
        <label className="filter-label" htmlFor="playerFilter">
          Filter by Player:{" "}
        </label>

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
