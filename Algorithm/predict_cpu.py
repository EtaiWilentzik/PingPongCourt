import os
import torch
from ultralytics import YOLO
# from Ball import Ball
# from Table import Table
import sys
from Game import Game
from Constants import Constants
from video_handler_cpu import VideoHandler
from mini_court import MiniCourt
from gestureFrameCounter import gestureFrameCounter

# * in the screen - (0, 0) is top left corner!
# * process the first 2 seconds to get the shape on the table and the net.


def process_initial_frames():
    results = model.predict(video_handler.get_frame())[0]
    for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():
        if score > Constants.THRESHOLD:
            if class_id == Constants.TABLE_ID:
                # Collect table coordinates for averaging
                game.table.sum_table((left_x, top_y), (right_x, bottom_y))
            elif class_id == Constants.NET_ID:
                # Collect net coordinates for averaging
                game.table.sum_net((left_x, top_y), (right_x, bottom_y))
    video_handler.write_video()
    Constants.counterUntilFrame += 1
    video_handler.read_next_frame()


def process_game_frames():
    # * if there is more than one ball, we set the coordinates more than one and its interrupt the calculation inside double bounce for example.
    best_ball_x_center, best_ball_y_center, best_score_ball = 0, 0, 0
    right_side, left_side = False, False
    for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():
        x_center = (left_x + right_x) // 2
        y_center = (top_y + bottom_y) // 2

        if score > Constants.THRESHOLD:
            if class_id == Constants.Ball_ID_NEW_TRAIN:
                # Update ball position and speed
                if (best_score_ball < score):
                    best_score_ball = score
                    best_ball_y_center = y_center
                    best_ball_x_center = x_center
            elif class_id == Constants.Hand_ID_NEW_TRAIN:
                # * if there were many hands, if we saw one hand in left side it will be true.
                left_side = game.test_left_hand(
                    (left_x, top_y), (right_x, bottom_y)) or left_side
                right_side = game.test_right_hand(
                    (left_x, top_y), (right_x, bottom_y)) or right_side

    # if we didn't recognize ball, we dont want to add any new coordinate of the ball
    if (best_score_ball != 0):
        game.ball.set_coordinates(best_ball_x_center, best_ball_y_center)
    #!to ask adi why we check for hands for every frame and not only when we are inside check hands
    check_hands.update(left_side, right_side)


if __name__ == "__main__":
    if len(sys.argv) != 6:
        sys.exit(1)

    # Get the video name directly from the command-line argument
    video_path = sys.argv[1]
    left_player_id = sys.argv[2]
    right_player_id = sys.argv[3]
    # * starter need to be zero or 1 0 is left player and 1 is right player.
    starter = int(sys.argv[4])
    game_id = sys.argv[5]
    # Pass the video name to VideoHandler
    video_handler = VideoHandler(video_path)
    mini_court = MiniCourt(VideoHandler.frame)
    model_path = os.path.abspath(
        './train9/weights/last.pt')  # Use an absolute path this run from Server!
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f'Using device: {device}')
    if torch.cuda.is_available():
        torch.cuda.set_device(0)
    model = YOLO(model_path)
    model.to(device=device)
    check_hands = gestureFrameCounter()
    game = Game(check_hands, (left_player_id,
                right_player_id), starter, game_id)
    # identify for the first 2 seconds only table and net.
    for i in range(2 * Constants.FPS):
        process_initial_frames()

    model_path = os.path.abspath(
        './train13/weights/last.pt')  # Use an absolute path
    model = YOLO(model_path)
    # determine the table and the net locations.
    game.set_game_constants()

    while video_handler.get_ret() and game.is_alive():
        results = model.predict(video_handler.get_frame())[0]
        process_game_frames()
        game.judge(VideoHandler.frame, Constants.counterUntilFrame)
        video_handler.paint_ball_movement(game)
        video_handler.paint_two_sides_and_zones(game)
        mini_court.draw_mini_court(VideoHandler.frame, game)
        video_handler.paint_frame_counter()
        video_handler.paint_score(game)
        video_handler.write_video()
        Constants.counterUntilFrame += 1
        video_handler.read_next_frame()
    game.game_stats.end_of_game_statistics(
        game.track_score, game.ball, video_handler.video_path_out)

    video_handler.release()
    print("finished running the Algorithm")
try:
    os.remove(video_handler.video_path)
    print("File successfully removed.")
except FileNotFoundError:
    print("The file does not exist.")
except PermissionError:
    print("Permission denied to remove the file.")
except Exception as e:
    print(f"An error occurred: {e}")
