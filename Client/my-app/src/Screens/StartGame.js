import "./StartGame.css";
import { Link } from "react-router-dom";
import { ScoreBoard } from "../nothing/ScoreBoard";
const StartGame = () => {
  return (
    <div className="game-container">
      <div className="image-container">
        <img src="/start.jpg" alt="Game" className="game-image" />
        <Link to="/score">
          <button type="button" className="btn btn-danger game-link">
            Play
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StartGame;
export { StartGame };
