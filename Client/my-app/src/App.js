
import { Log} from "./LogIn";
import {Reg} from "./Register"
import About from "./About";
import Video from "./Video";
import "./App.css"
import  {Route,Routes}from "react-router-dom"
import {ErrorRoute} from "./ErrorRoute";
import {ScoreBoard} from "./ScoreBoard";
import {StartGame} from "./StartGame";
import { Stats } from "./Stats";
function App() {
    return (
        <>
             {/*<Nav/>*/}
            <Routes>
                <Route path="/" element={<Video/>}/>
                <Route path="/register" element={<Reg/>}/>
                <Route path="/login" element={<Log/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/start" element={<StartGame/>}/>
                <Route path="/score" element={<ScoreBoard/>}/>
                <Route path="/statistics" element={<Stats/>}/>
                <Route path="/*" element={<ErrorRoute/>}/>
            </Routes>

            {/*<p>hello world</p>*/}
            {/*<Video/>*/}
            {/*<About/>*/}
            {/*<FadeMedia /> /!* Use the FadeMedia component here *!/*/}
            {/*<NavBar/>*/}
            {/*<ParagraphsContainer/>*/}
            {/*<LogIn/>*/}
            {/*<Register/>*/}
            {/*<Reg/>*/}
            {/*            <MovingText text="This is my scrolling text. You can add any data you want here!" />*/}


            {/*<Log/>>*/}
            {/*<GPT/>*/}
            {/*      <Try />*/}
            {/*<CoolStaff/>*/}
            {/* <Demo logo={logo} /> */}

        </>
    );
}

export default App;
