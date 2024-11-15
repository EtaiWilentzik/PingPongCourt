import "./About.css";
import {Nav} from "./NavBar";
import { motion } from 'framer-motion';

const About = () => {
    return (
        <>
            {/*<p className="Header"> hello  </p>*/}
            <div>
                <motion.div
                    className="about-section"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 1.5}}
                >
                    <div className="about-content">
                        <h1 className="neon-title"> Ping Pong Judge</h1>
                        <p className="about-text">
                            Welcome to <span className="highlight">Ping Pong Judge</span>, the future of table tennis
                            analysis! Our cutting-edge platform
                            leverages <span className="highlight">YOLOv8’s AI technology</span> to deliver real-time
                            game
                            analysis and instant judgment.
                            Designed with a sleek, neon-inspired interface, Ping Pong Judge helps you track every shot
                            with
                            precision and style.
                        </p>
                        <p className="about-text">
                            Elevate your matches with <span className="highlight">Ping Pong Judge</span>—where
                            technology
                            meets table tennis!
                        </p>
                    </div>
                </motion.div>
            </div>
            {/*<header>*/}
            {/*    <h1>Gradient Header</h1>*/}
            {/*</header>*/}


        </>

    );

}

export default About;
