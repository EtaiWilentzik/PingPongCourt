# Ping Pong Court

## Table of Contents
- [Ping Pong Court](#ping-pong-court)
  - [Table of Contents](#table-of-contents)
  - [General Information](#general-information)
  - [Features](#features)
    - [Core Functionalities](#core-functionalities)
    - [Enhanced Features](#enhanced-features)
  - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
  - [Usage](#usage)
    - [Uploading and Processing Videos](#uploading-and-processing-videos)
    - [Reviewing Game Statistics](#reviewing-game-statistics)
  - [Example Videos](#example-videos)
    - [Original Video](#original-video)
    - [Processed Video](#processed-video)
  - [Screenshots](#screenshots)
    - [Home Screen](#home-screen)
    - [About](#about)
    - [Register](#register)
    - [Log in](#log-in)
    - [game List](#game-list)
    - [Game Analysis](#game-analysis)
    - [Total Statistic](#total-statistic)
  - [Built With](#built-with)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
  - [Author](#author)
  - [License](#license)
    - [Video Attribution](#video-attribution)
  - [Support 🤝](#support-)

## General Information
**Ping Pong Court** is an innovative web application designed to serve as an automated referee for ping pong games, complete with detailed statistical reports. Utilizing advanced computer vision and object detection technologies, the app analyzes gameplay from video footage, accurately judging points and providing comprehensive game insights. Whether you're a casual player looking to improve or a competitive athlete seeking detailed analysis, Ping Pong Court offers valuable statistics and visualizations to enhance your game.

## Features

### Core Functionalities
- **YOLOv8 Model**: Utilizes a YOLOv8 model trained specifically for table tennis to detect and track relevant objects, including the ball, hands, table, and net.
- **Multi-Object Detection**: Simultaneously tracks multiple objects to provide a comprehensive overview of the game.
- **Game Event Detection**: Automatically detects key events such as bounces, double bounces, and floor hits.
- **Player Scoring**: Updates and displays scores based on detected events.

### Enhanced Features
- **Detailed Game Stats**: Track faults, rallies, aces, and scores from your gameplay videos. Our advanced AI technology provides insights into your performance, helping you understand your strengths and weaknesses.
- **Comprehensive Reports**: Receive detailed breakdowns of your games with our in-depth analysis system. Each match report includes performance metrics and strategic insights.
- **Interactive Visualizations**: Experience your game data through dynamic charts and graphs that highlight key statistics. View detailed breakdowns of ball depth, speed, and player-specific patterns, making it easier than ever to analyze and improve your matches.
- **Shot Accuracy Insights**: Get precise feedback on your shot placement with our advanced tracking system. Our AI creates detailed heat maps showing where your balls hit the table, helping you identify patterns and refine your accuracy for better game control.
- **Video Playback with AI**: Review your games with our intelligent replay system featuring AI-generated overlays. Watch as our system automatically highlights key moments, tracks ball trajectories, and provides analysis of your technique and strategy.

## Setup

### Prerequisites
- **Node.js & npm**: Ensure you have Node.js and npm installed on your machine.
- **Python**: Required for backend processing.
- **MongoDB Compass**: For database management.
- **CUDA-Compatible GPU**: To leverage CUDA acceleration for efficient processing, if available.
- 
### Installation Steps

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/EtaiWilentzik/PingPongCourt.git
    ```

2. **Navigate to the Project Directory**:

    ```bash
    cd PingPongCourt
    ```

3. **Install Frontend Dependencies**:

    ```bash
    cd Client/my-app
    npm install
    npm start
    ```

4. **Setup the Python Backend (Algorithm)**:

    ```bash
    cd ../Algorithm
    ```
    - **Install Backend Dependencies**:

        ```powershell
        pip install -r requirements.txt
        ```
5. **Setup the Server Backend**:

    After setting up the Python backend, navigate to the `Server` directory to set up the server-side backend.

    ```bash
    cd ../Server
    ```

    - **Install Server Dependencies**:

        ```bash
        npm install
        ```

    - **Start the Server Backend**:

        ```bash
        npm start
        ```

6. **Configure the Database**:

    - Open **MongoDB Compass** and connect to `localhost` using the default settings or your specific configuration.

7. **Access the Application**:

    - **Frontend**: [http://localhost:3001](http://localhost:3001)
    - **Server Backend**: [http://localhost:3000](http://localhost:3000)
    - **Python Backend**: Depends on your Python server's configuration (e.g., [http://localhost:5000](http://localhost:5000))

---

## Usage

### Uploading and Processing Videos

1. **Upload a Video**: Navigate to the upload section and select a ping pong game video.
2. **Process the Video**: The app will process the footage, detecting objects and events from the video.
3. **View Insights**:
    - **Detailed Game Metrics**: Access comprehensive game insights such as ball speed, longest rally, and scoring events overlaid on the video.
    - **Table Depth Analysis**: Utilize the **Table Depth Analysis** feature, which divides the table into **8 distinct sections**. This segmentation allows you to:
        - **Visualize Ball Impact Zones**: Identify where most of the ball hits occur on the table.
        - **Analyze Gameplay Patterns**: Understand player strategies and shot placements based on the depth distribution.
        - **Enhance Training Sessions**: Use the depth data to focus on specific areas of the table during practice.
        - **Compare Performance**: Evaluate consistency and accuracy in ball placement across different game sessions.


### Reviewing Game Statistics
- **Ball Speed**: Monitor the speed of the ball throughout the game.
- **Longest Rally**: Identify and review the longest rally achieved during the match.
- **Ball Tracking**: Visualize the ball’s trajectory with each bounce marked on the table.
- **Shot Accuracy**: Analyze heat maps and shot placement to improve your accuracy.

## Example Videos


### Original Video
[![Watch the Original Video on YouTube](./README/a.jpg)](https://youtu.be/C6tf-zfGRhA)

### Processed Video
[![Watch the Processed Video](./README/a.jpg)](https://youtu.be/_Kt6gBol-RI)





## Screenshots

### Home Screen 
<img src="/README/home.png" width="200" alt="Home Screen">

### About 
<img src="/README/about.png" width="200" alt="About">

### Register 
<img src="/README/register.png" width="200" alt="Register">

### Log in 
<img src="/README/login.png" width="200" alt="Log in">

### Game List 
<img src="/README/gamelist.png" width="200" alt="Game List">

### Game Analysis 
<img src="/README/exampleGame.png" width="200" alt="Game Analysis">

### Total Statistic 
<img src="/README/personalStats.png" width="200" alt="Detailed Stats">

## Built With

### Frontend
- **React**: For building the user interface.
- **Framer Motion**: For animations and transitions.
- **CSS**: Styling the application.

### Backend
- **Python**: Core backend processing.
- **YOLOv8**: Object detection model for analyzing gameplay.
- **OpenCV**: Computer vision library for video processing.
- **Node.js**: For handling the server.
- **Express**: Web framework for handling API requests.

### Database
- **MongoDB**: For storing game data and user information.

## Author
**Etai Wilentzik**  
* [GitHub Profile](https://github.com/EtaiWilentzik)
* [LinkedIn](https://www.linkedin.com/in/etai-wilentzik/)



## License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for more details.

### Video Attribution

The homepage video is sourced from the talented **Jepta Visuals**, who has graciously granted permission for its use in this project. For more information or inquiries, you can reach out to him at [jeptavisuals@gmail.com](mailto:jeptavisuals@gmail.com).



## Support 🤝
Contributions, issues, and feature requests are welcome!  

Give a ⭐️ if you like this project!
