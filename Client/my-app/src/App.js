import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Screen, SCREEN_TYPE } from "./Screen";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Screen screenType={SCREEN_TYPE.MAIN} />} />
                <Route path="/register" element={<Screen screenType={SCREEN_TYPE.REGISTER} />} />
                <Route path="/login" element={<Screen screenType={SCREEN_TYPE.LOGIN} />} />
                <Route path="/about" element={<Screen screenType={SCREEN_TYPE.ABOUT} />} />
                <Route path="/start" element={<Screen screenType={SCREEN_TYPE.START} />} />
                <Route path="/score" element={<Screen screenType={SCREEN_TYPE.SCORE} />} />
                <Route path="/statistics" element={<Screen screenType={SCREEN_TYPE.STATISTICS} />} />
                <Route path="/*" element={<Screen screenType={SCREEN_TYPE.ERROR} />} />
            </Routes>
        </>
    );
}

export default App;
