import "./App.css";
import { Route, Routes, useParams } from "react-router-dom";
import { Screen, SCREEN_TYPE } from "./Screen";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Screen screenType={SCREEN_TYPE.MAIN} />} />
        <Route path="/register" element={<Screen screenType={SCREEN_TYPE.REGISTER} />} />
        <Route path="/login" element={<Screen screenType={SCREEN_TYPE.LOGIN} />} />
        <Route path="/about" element={<Screen screenType={SCREEN_TYPE.ABOUT} />} />
        <Route path="/start" element={<Screen screenType={SCREEN_TYPE.START} />} />
        <Route path="/score" element={<Screen screenType={SCREEN_TYPE.SCORE} />} />
        <Route
          path="/statistics"
          element={
            <PrivateRoute>
              <Screen screenType={SCREEN_TYPE.STATISTICS} />
            </PrivateRoute>
          }
        />
        <Route
          path="/allGames"
          element={
            <PrivateRoute>
              <Screen screenType={SCREEN_TYPE.ALL_GAMES} />
            </PrivateRoute>
          }
        />
        <Route
          path="/addGame"
          element={
            <PrivateRoute>
              <Screen screenType={SCREEN_TYPE.ADD_GAME} />
            </PrivateRoute>
          }
        />
        <Route
          path="/allGames/:gameId"
          element={
            <PrivateRoute>
              <GameScreenWrapper />
            </PrivateRoute>
          }
        />
        <Route path="/*" element={<Screen screenType={SCREEN_TYPE.ERROR} />} />
      </Routes>
    </AuthProvider>
  );
}

function GameScreenWrapper() {
  const { gameId } = useParams(); // Get the `gameId` parameter from the route
  return <Screen screenType={SCREEN_TYPE.GAME_STATS} gameId={gameId} />;
}

export default App;
