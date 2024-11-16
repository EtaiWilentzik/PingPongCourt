import os
from turtle import update
import torch
from ultralytics import YOLO
from Ball import Ball
from Table import Table
from Game import Game
from Constants import Constants
from video_handler_cpu import VideoHandler
from mini_court import MiniCourt
from gestureFrameCounter import gestureFrameCounter
""" 
just for reading in correctly. 
#* is important comment about the game 
#todo: is something we need to change
#? this is something that we need to check about it 
#! this is something that we dont need at the end or something that need to changed. 
 """
# * in the screen - (0, 0) is top left corner!
#! remove everything that has the variable demo counter


# * etai changed it to work from another function for better readability also i added the if elif elif for better performance.

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
    # if there is more than one ball we set the coordinates more than one and its interrupt the calculation inside double bounce for example.
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

                # game.ball.set_coordinates(x_center, y_center)
                # game.ball.set_speed()
                # video_handler.paint_ball_movement(game)
                # Test game rules and update scores
                # game.test_frame(video_handler.get_frame(),
                #                 Constants.counterUntilFrame)
            elif class_id == Constants.Hand_ID_NEW_TRAIN:
                # Process hand detections
                # if there were many hands if we saw one hand in left side it will be true.
                left_side = game.test_left_hand(
                    (left_x, top_y), (right_x, bottom_y)) or left_side
                right_side = game.test_right_hand(
                    (left_x, top_y), (right_x, bottom_y)) or right_side
        video_handler.paint_all(left_x, top_y, right_x,
                                bottom_y, results.names[int(class_id)], score)
    if (best_score_ball != 0):
        game.ball.set_coordinates(best_ball_x_center, best_ball_y_center)
        game.ball.set_speed()
    check_hands.update(left_side, right_side)

print("start running the code")
video_handler = VideoHandler()
# create mini_court draw
mini_court = MiniCourt(VideoHandler.frame)
model_path = os.path.join('.', 'train9',
                          'weights', 'last.pt')  # get the training set
# use cuda if possible
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f'Using device: {device}')
# do it only for etai
if torch.cuda.is_available():
    torch.cuda.set_device(0)

model = YOLO(model_path)  # load a custom model

model.to(device=device)
check_hands = gestureFrameCounter()
game = Game(check_hands, ("Etai", "Daniel"))


for i in range(2*Constants.FPS):
    process_initial_frames()

model_path = os.path.join('.', 'train13',
                          'weights', 'last.pt')
model = YOLO(model_path)  # load a custom model

game.set_game_constants()


while video_handler.get_ret() and game.is_alive():
    results = model.predict(video_handler.get_frame())[0]
    process_game_frames()
    game.judge(VideoHandler.frame, Constants.counterUntilFrame)
    video_handler.paint_ball_movement(game)
    # * this need to be last because at the end there is self.out.write(self.frame)
    video_handler.paint_two_sides_and_zones(game)

    # * drawing the mini court inside the frame.
    mini_court.draw_mini_court(VideoHandler.frame, game)
    # * drawing the frame counter at the top left corner.
    video_handler.paint_frame_counter()
    video_handler.paint_score(game)

    video_handler.write_video()

    Constants.counterUntilFrame += 1
    video_handler.read_next_frame()
game.game_stats.end_of_game_statistics(game.track_score)
video_handler.release()


