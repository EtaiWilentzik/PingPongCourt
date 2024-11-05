import os
import torch
from ultralytics import YOLO
from Ball import Ball
from Table import Table
from Game import Game
from Constants import Constants
from video_handler import VideoHandler
from mini_court import MiniCourt

""" 
just for reading in correctly. 
#* is important comment about the game 
#todo: is something we need to change
#? this is something that we need to check about it 
#! this is something that we dont need at the end or something that need to changed. 
 """
# * in the screen - (0, 0) is top left corner!
#! remove everything that has the variable demo counter
demo_counter = 0
video_handler = VideoHandler()
# create mini_court draw
mini_court = MiniCourt(VideoHandler.frame)
model_path = os.path.join('.', 'Algorithm', 'train9',
                          'weights', 'best.pt')  # get the training set
# use cuda if possible
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f'Using device: {device}')
# do it only for etai
if torch.cuda.is_available():
    torch.cuda.set_device(0)

model = YOLO(model_path)  # load a custom model
print("im here after the model")
model.to(device=device)
game = Game(Ball(), Table())
while video_handler.get_ret():  # until no more frames

    # start_time = time.time()

    # max_det=3 in model.predict say how many object i want to detect
    results = model.predict(video_handler.get_frame())[0]

    for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():  # coordinates, accuracy ,
        # class_id(like train)
        xCenter = (left_x + right_x) // 2  # Calculate x-center
        yCenter = (top_y + bottom_y) // 2  # Calculate y-center
        if score > Constants.THRESHOLD:
            if class_id == Constants.TABLE_ID:
                # 2 seconds of fixing table coordinates until beginning
                if Constants.counterUntilFrame <= 2 * Constants.FPS:

                    # summing coordinates to calc avg
                    game.table.sum_table((left_x, top_y), (right_x, bottom_y))

            if class_id == Constants.NET_ID:
                # 2 seconds of fixing table coordinates until beginning
                if Constants.counterUntilFrame <= 2 * Constants.FPS:
                    game.table.sum_net((left_x, top_y), (right_x, bottom_y))

            if class_id == Constants.Ball_ID:
                # adding new coordinates to the list
                game.ball.set_coordinates(xCenter, yCenter)

                game.ball.set_speed()
                # etai moved it here from the same indentation as the if classes conditions i.e. one after the if
                # threshold.
                video_handler.paint_ball_movement(game)

                # checks if there was a bounce and determine the rest of the
                #! we dont need the line below i think.
                game.test_frame(video_handler.get_frame(),
                                Constants.counterUntilFrame, )
        # ? this draw every object that yolo detect
        video_handler.paint_all(left_x, top_y, right_x,
                                bottom_y, results.names[int(class_id)], score, demo_counter)

    # * setting the position of table after calculating avg of coordinates
    if Constants.counterUntilFrame == 2 * Constants.FPS:
        game.set_game_constants()

    # todo showing the result of the live game right now its not working good.
    # video_handler.draw_result()

    # * this need to be last because at the end there is self.out.write(self.frame)
    video_handler.paint_two_sides(game)

    #! we dont need this line here because its outside to the detection of the ball.
    # video_handler.paint_ball_movement(game)

    # * drawing the mini court inside the frame.
    mini_court.draw_mini_court(VideoHandler.frame, game)
    # * drawing the frame counter at the top left corner.
    video_handler.paint_frame_counter()
    # put this line in comment after finishing

    # * write the frame to the video this function must be last!.
    video_handler.write_video()
    # elapsed_time_ms = (time.time() - start_time) * 1000
    Constants.counterUntilFrame += 1

    video_handler.read_next_frame()

video_handler.release()
print("finished")
