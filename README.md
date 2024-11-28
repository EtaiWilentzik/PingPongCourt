# Ping Pong Court

This project is a web application designed to act as a referee for ping pong games. It uses computer vision and object detection to track gameplay and accurately judge points.

The app can handle both live video from a webcam and stored videos from previous games. It processes the footage and provides detailed game insights, such as ball speed, longest rally, scoring events, and more. This allows players to review their gameplay with valuable statistics and analysis.



## Game Analysis and Statistics

The app provides a comprehensive analysis of each game, offering the following insights and **more** :

- **Ball Speed**: Calculates and displays the ball's real-time speed, helping players gauge the pace of their rallies.
- **Longest Rally**: Tracks the duration of each rally and highlights the longest one at the end of the game.
- **Ball Tracking**: Displays the ball’s trajectory throughout the game, marking each bounce on the table to provide a visual overview of the ball's path.
 ![image](https://github.com/user-attachments/assets/b24dd202-8e85-4811-b34d-fa18749aec3e)



These statistics are overlaid on the video, making it easy to follow gameplay details as they happen.

## Example Videos

To demonstrate the app's capabilities, you can upload short example videos showing the difference between the original and processed footage. Each example video can include:

1. **Original Video**: Raw footage of a ping pong game, without any overlays or analysis.

https://github.com/user-attachments/assets/73473dc1-af92-49a0-8bc6-6409c1b8cc34
   

2. **Processed Video**: The same footage after processing, enhanced with game details






https://github.com/user-attachments/assets/bef26d4d-fcb8-4965-9857-4376a6f3f4bd



<h2>Features</h2>
<ul>
  <li><strong>YOLOv8 Model:</strong> A YOLOv8 model trained specifically for table tennis is used to detect and track object relevant to the game.</li>
  <li><strong>Multi-Object Detection:</strong> The model is trained to detect not only the ball but also other relevant objects such as hands, table, net, etc.</li>
  <li><strong>CUDA Acceleration:</strong> The use of CUDA technology ensures fast processing, allowing for seamless real-time performance.</li>
  <li><strong>Game Event Detection:</strong> The system detects key events such as bounces on the table, double bounces, and when the ball hits the floor.</li>
  <li><strong>Player Scoring:</strong> Automatically updates and displays the score based on the detected events.</li>












