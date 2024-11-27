import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./About.css";

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      title: "Detailed Game Stats",
      description:
        "Track faults, rallies, aces, and scores in real-time. Our advanced AI technology analyzes every aspect of your game, providing instant insights into your performance and helping you understand your strengths and weaknesses at a glance.",
    },
    {
      title: "Comprehensive Reports",
      description:
        "Receive detailed breakdowns of your games with our in-depth analysis system. Each match report includes performance metrics, strategy insights, and personalized recommendations to help you focus on specific areas for improvement.",
    },
    {
      title: "Interactive Visualizations",
      description:
        "Experience your game data through dynamic charts and graphs that highlight key statistics. View detailed breakdowns of ball depth, speed, and player-specific patterns, making it easier than ever to analyze and improve your matches.",
    },
    {
      title: "Shot Accuracy Insights",
      description:
        "Get precise feedback on your shot placement with our advanced tracking system. Our AI creates detailed heat maps showing where your balls hit the table, helping you identify patterns and refine your accuracy for better game control.",
    },
    {
      title: "Video Playback with AI",
      description:
        "Review your games with our intelligent replay system featuring AI-generated overlays. Watch as our system automatically highlights key moments, tracks ball trajectories, and provides real-time analysis of your technique and strategy.",
    },
  ];

  const nextFeature = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="about-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="about-content">
        <h1 className="about-title">Ping Pong Court</h1>

        <div className="image-container">
          <img src="/picture4.jpg" alt="Ping Pong Judge" className="about-photo" />
        </div>

        <div className="intro-text">
          <p>
            Welcome to <span className="highlight-pink">Ping Pong Court</span>, powered by{" "}
            <span className="highlight-pink">YOLOv8's AI</span> for instant table tennis analysis.
          </p>
          <p>
            <span className="highlight-yellow">Where technology meets table tennis!</span>
          </p>
        </div>

        <div className="feature-container">
          <div className="arrow-container left">
            <button onClick={prevFeature} className="arrow-button" aria-label="Previous feature">
              ←
            </button>
          </div>

          <div className="arrow-container right">
            <button onClick={nextFeature} className="arrow-button" aria-label="Next feature">
              →
            </button>
          </div>

          <div className="feature-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="feature-text"
              >
                <h3 className="feature-title">{features[currentIndex].title}</h3>
                <p className="feature-description">{features[currentIndex].description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="dot-indicators">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
