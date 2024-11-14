# import os

# import cProfile
# import torch
# from ultralytics import YOLO
# from Ball import Ball
# from Table import Table
# from Game import Game
# from Constants import Constants
# from video_handler import VideoHandler
# from mini_court import MiniCourt
# from gestureFrameCounter import gestureFrameCounter
# """
# just for reading in correctly.
# #* is important comment about the game
# #todo: is something we need to change
# #? this is something that we need to check about it
# #! this is something that we dont need at the end or something that need to changed.
#  """
# # * in the screen - (0, 0) is top left corner!
# #! remove everything that has the variable demo counter


# # * etai changed it to work from another function for better readability also i added the if elif elif for better performance.

# def process_initial_frames():
#     results = model.predict(video_handler.get_frame())[0]
#     for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():
#         if score > Constants.THRESHOLD:
#             if class_id == Constants.TABLE_ID:
#                 # Collect table coordinates for averaging
#                 game.table.sum_table((left_x, top_y), (right_x, bottom_y))
#             elif class_id == Constants.NET_ID:
#                 # Collect net coordinates for averaging
#                 game.table.sum_net((left_x, top_y), (right_x, bottom_y))
#     video_handler.write_video()
#     Constants.counterUntilFrame += 1
#     video_handler.read_next_frame()


# def process_game_frames():
#     # if there is more than one ball we set the coordinates more than one and its interrupt the calculation inside double bounce for example.
#     best_ball_x_center, best_ball_y_center, best_score_ball = 0, 0, 0
#     right_side, left_side = False, False
#     for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():
#         x_center = (left_x + right_x) // 2
#         y_center = (top_y + bottom_y) // 2

#         if score > Constants.THRESHOLD:
#             if class_id == Constants.Ball_ID:
#                 # Update ball position and speed
#                 if (best_score_ball < score):
#                     best_score_ball = score
#                     best_ball_y_center = y_center
#                     best_ball_x_center = x_center

#                 # game.ball.set_coordinates(x_center, y_center)
#                 # game.ball.set_speed()
#                 # video_handler.paint_ball_movement(game)
#                 # Test game rules and update scores
#                 # game.test_frame(video_handler.get_frame(),
#                 #                 Constants.counterUntilFrame)
#             elif class_id == Constants.Hand_ID:
#                 # Process hand detections
#                 # if there were many hands if we saw one hand in left side it will be true.
#                 left_side = game.test_left_hand(
#                     (left_x, top_y), (right_x, bottom_y)) or left_side
#                 right_side = game.test_right_hand(
#                     (left_x, top_y), (right_x, bottom_y)) or right_side
#         video_handler.paint_all(left_x, top_y, right_x,
#                                 bottom_y, results.names[int(class_id)], score)
#     if (best_score_ball != 0):
#         game.ball.set_coordinates(best_ball_x_center, best_ball_y_center)
#         game.ball.set_speed()
#     check_hands.update(left_side, right_side)


# video_handler = VideoHandler()
# # create mini_court draw
# mini_court = MiniCourt(VideoHandler.frame)
# model_path = os.path.join('.', 'Algorithm', 'train11',
#                           'weights', 'best.pt')  # get the training set
# # use cuda if possible
# device = 'cuda' if torch.cuda.is_available() else 'cpu'
# print(f'Using device: {device}')
# # do it only for etai
# if torch.cuda.is_available():
#     torch.cuda.set_device(0)

# model = YOLO(model_path)  # load a custom model

# model.to(device=device)
# check_hands = gestureFrameCounter()
# game = Game(check_hands)


# for i in range(2*Constants.FPS):
#     process_initial_frames()

# game.set_game_constants()


# while video_handler.get_ret() and game.is_alive():
#     results = model.predict(video_handler.get_frame())[0]
#     process_game_frames()
#     game.judge(VideoHandler.frame, Constants.counterUntilFrame)
#     video_handler.paint_ball_movement(game)
#     # * this need to be last because at the end there is self.out.write(self.frame)
#     video_handler.paint_two_sides_and_zones(game)

#     # * drawing the mini court inside the frame.
#     mini_court.draw_mini_court(VideoHandler.frame, game)
#     # * drawing the frame counter at the top left corner.
#     video_handler.paint_frame_counter()
#     video_handler.paint_score(game)

#     video_handler.write_video()

#     Constants.counterUntilFrame += 1
#     video_handler.read_next_frame()

# video_handler.release()


# predict.py
# predict.py

import multiprocessing
import os
from pstats import Stats
import torch
from ultralytics import YOLO
from multiprocessing import Process, Queue, Event

from Constants import Color, Constants
from video_handler import VideoReader, VideoWriter
from mini_court import MiniCourt
from gestureFrameCounter import gestureFrameCounter
from Game import Game
import cv2
import logging
import traceback
import time

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(processName)s:%(levelname)s:%(message)s')


def process_initial_frames(results, game):
    for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():
        if score > Constants.THRESHOLD:
            if class_id == Constants.TABLE_ID:
                game.table.sum_table((left_x, top_y), (right_x, bottom_y))
            elif class_id == Constants.NET_ID:
                game.table.sum_net((left_x, top_y), (right_x, bottom_y))


def process_game_frames(results, game):
    best_ball_x_center, best_ball_y_center, best_score_ball = 0, 0, 0
    right_side, left_side = False, False
    for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():
        x_center = (left_x + right_x) // 2
        y_center = (top_y + bottom_y) // 2

        if score > Constants.THRESHOLD:
            if class_id == Constants.Ball_ID_NEW_TRAIN:
                # this is for indemnify the best ball if there is more than one .
                if best_score_ball < score:
                    best_score_ball = score
                    best_ball_y_center = y_center
                    best_ball_x_center = x_center
            elif class_id == Constants.Hand_ID_NEW_TRAIN:
                left_side = game.test_left_hand(
                    (left_x, top_y), (right_x, bottom_y)) or left_side
                right_side = game.test_right_hand(
                    (left_x, top_y), (right_x, bottom_y)) or right_side

    if best_score_ball != 0:
        game.ball.set_coordinates(best_ball_x_center, best_ball_y_center)
        game.ball.set_speed()
    game.check_hands.update(left_side, right_side)


def annotate_frame(frame, results, game, mini_court):
    # Paint all detections
    for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():
        label = f"{results.names[int(class_id)]} ({score:.2f})"

        cv2.rectangle(frame, (int(left_x), int(top_y)),
                      (int(right_x), int(bottom_y)), Color.GREEN, 4)
        cv2.putText(frame, label, (int(left_x), int(top_y) - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.3, Color.GREEN, 3)
        # Add more conditions for other classes as needed

    # Paint ball movement
    tmp_positions = game.ball.get_positions()
    for i, pos in enumerate(tmp_positions):
        if pos.is_vertical():
            cv2.circle(frame, (pos.x, pos.y), 25,
                       Color.RED, cv2.FILLED)
        else:
            cv2.circle(frame, (pos.x, pos.y), 5,
                       Color.GREEN, cv2.FILLED)
        if i != 0:
            cv2.line(frame, (pos.x, pos.y),
                     (tmp_positions[i - 1].x, tmp_positions[i - 1].y), Color.BLACK, 2)
    if game.ball.speeds:
        cv2.putText(
            frame, f"The speed is {game.ball.speeds[-1]}", (90, 90), cv2.FONT_HERSHEY_SIMPLEX, 4, Color.CYAN, 3)

    # Paint two sides and zones
    cv2.rectangle(frame, (int(game.table.left_table[0]), int(game.table.left_table[1])),
                  (int(game.table.left_table[2]), int(game.table.left_table[3])), Color.BROWN, 4)
    cv2.rectangle(frame, (int(game.table.right_table[0]), int(game.table.right_table[1])),
                  (int(game.table.right_table[2]), int(game.table.right_table[3])), Color.PINK, 4)
    cv2.rectangle(frame, (int(game.table.left_zone[0]), int(game.table.left_zone[1])),
                  (int(game.table.left_zone[2]), int(game.table.left_zone[3])), Color.GREEN, 4)
    cv2.rectangle(frame, (int(game.table.right_zone[0]), int(game.table.right_zone[1])),
                  (int(game.table.right_zone[2]), int(game.table.right_zone[3])), Color.GREEN, 4)

    # Draw mini court
    if mini_court:
        mini_court.draw_mini_court(frame, game)

    # Paint frame counter and score
    cv2.putText(frame, f"Frame number: {Constants.counterUntilFrame}",
                (10, 30), cv2.FONT_HERSHEY_PLAIN, 2, Color.BLUE, 2)
    cv2.putText(frame, f"Score: {game.track_score.get_score()}",
                (100, 100), cv2.FONT_HERSHEY_PLAIN, 2, Color.BLUE, 2)
    cv2.putText(frame, f"State: {game.game_status.state}",
                (700, 100), cv2.FONT_HERSHEY_PLAIN, 2, Color.RED, 2)
    cv2.putText(frame, f"Reason: {Constants.WON_REASON}",
                (1400, 100), cv2.FONT_HERSHEY_PLAIN, 2, Color.RED, 2)
    cv2.putText(frame, f"last hit: {game.last_side_hitter}",
                (1400, 250), cv2.FONT_HERSHEY_PLAIN, 2, Color.RED, 2)
    return frame


def frame_reader_process(video_path, frame_queue, read_complete_event):
    try:
        logging.debug('Starting frame_reader_process')
        video_reader = VideoReader(video_path)
        while True:
            ret, frame = video_reader.read_frame()
            if not ret:
                read_complete_event.set()
                logging.debug(
                    'No more frames to read, exiting frame_reader_process')
                break
            frame_queue.put(frame)
            logging.debug('Frame put into frame_queue')
        video_reader.release()
    except Exception as e:
        logging.error(f'Exception in frame_reader_process: {e}')
        traceback.print_exc()


def inference_process(frame_queue, output_queue, read_complete_event, inference_complete_event, initial_model_path, game_model_path):
    try:
        logging.debug('Starting inference_process')
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        logging.debug(f'Using device: {device}')

        # Load the first model for initial frames
        initial_model = YOLO(initial_model_path)
        initial_model.to(device=device)

        # Load the second model for game frames
        game_model = YOLO(game_model_path)
        game_model.to(device=device)

        check_hands = gestureFrameCounter()
        game = Game(check_hands, ("Etai", "Daniel"))

        Constants.counterUntilFrame = 0

        mini_court = None
        initial_frames = []

        # Process initial frames using the first model
        while len(initial_frames) < 2 * Constants.FPS:
            if not frame_queue.empty():
                frame = frame_queue.get()
                logging.debug('Initial frame received from frame_queue')
                results = initial_model.predict(frame, half=True, conf=0.4)[0]
                process_initial_frames(results, game)
                annotated_frame = frame.copy()
                annotate_frame(annotated_frame, results, game, mini_court)
                output_queue.put(annotated_frame)
                initial_frames.append(frame)
                Constants.counterUntilFrame += 1
            elif read_complete_event.is_set() and frame_queue.empty():
                break
            else:
                time.sleep(0.01)  # Prevent tight loop

        game.set_game_constants()
        logging.debug('Game constants set')

        if initial_frames:
            mini_court = MiniCourt(initial_frames[-1])

        # Process game frames individually without stream=True
        while True:
            if not frame_queue.empty():
                frame = frame_queue.get()
                logging.debug('Frame received from frame_queue')
                results = game_model.predict(frame, half=True, conf=0.4)[0]
                process_game_frames(results, game)
                annotated_frame = frame.copy()
                annotate_frame(annotated_frame, results, game, mini_court)
                game.judge(frame, Constants.counterUntilFrame)
                output_queue.put(annotated_frame)
                logging.debug('Annotated frame put into output_queue')
                Constants.counterUntilFrame += 1
            elif read_complete_event.is_set() and frame_queue.empty():
                logging.debug(
                    'No more frames to process, exiting inference_process')
                break
                ########################
            else:
                time.sleep(0.01)  # Prevent tight loop
        inference_complete_event.set()
    except Exception as e:
        logging.error(f'Exception in inference_process: {e}')
        traceback.print_exc()


def frame_writer_process(output_path, frame_size, fps, output_queue, inference_complete_event):
    try:
        logging.debug('Starting frame_writer_process')
        video_writer = VideoWriter(output_path, frame_size, fps)
        logging.debug('VideoWriter initialized successfully')
        frames_written = 0  # Counter to track the number of frames written

        while True:
            if not output_queue.empty():
                logging.debug('Attempting to get frame from output_queue')
                frame = output_queue.get()
                logging.debug('Annotated frame received from output_queue')
                # Write the frame to the output video
                video_writer.write_frame(frame)
                frames_written += 1
                logging.debug(
                    f'Frame {frames_written} written to output video')
            elif inference_complete_event.is_set() and output_queue.empty():
                logging.debug(
                    'No more frames to write, exiting frame_writer_process')
                break
            else:
                time.sleep(0.01)  # Prevent tight loop
        video_writer.release()
        logging.debug('VideoWriter released successfully')
    except Exception as e:
        logging.error(f'Exception in frame_writer_process: {e}')
        traceback.print_exc()


if __name__ == "__main__":

    multiprocessing.set_start_method('spawn')

    VIDEOS_DIR = os.path.join('.', 'Algorithm', 'videos_new_new_new')
    video_path = os.path.join(VIDEOS_DIR, 'v2_short.mp4')
    output_path = f"{video_path}_out.mp4"
    initial_model_path = os.path.join(
        '.', 'Algorithm', 'train11', 'weights', 'best.pt')
    game_model_path = os.path.join(
        '.', 'Algorithm', 'train13', 'weights', 'best.pt')

    # Initialize VideoReader to get frame properties
    video_reader = VideoReader(video_path)
    ret, frame = video_reader.read_frame()
    if not ret:
        raise ValueError("Failed to read video")
    H, W, _ = frame.shape
    frame_size = (W, H)
    fps = int(video_reader.cap.get(cv2.CAP_PROP_FPS))
    video_reader.release()

    # Initialize queues and events
    frame_queue = Queue(maxsize=50)
    output_queue = Queue(maxsize=50)
    read_complete_event = Event()
    inference_complete_event = Event()

    # Create processes
    reader_proc = Process(target=frame_reader_process, args=(
        video_path, frame_queue, read_complete_event))
    inference_proc = Process(target=inference_process, args=(
        frame_queue, output_queue, read_complete_event, inference_complete_event, initial_model_path, game_model_path))
    writer_proc = Process(target=frame_writer_process, args=(
        output_path, frame_size, fps, output_queue, inference_complete_event))

    # Start processes
    reader_proc.start()
    inference_proc.start()
    writer_proc.start()

    # Wait for processes to finish
    reader_proc.join()
    inference_proc.join()
    writer_proc.join()

# import os
# import cProfile
# from numpy import half
# import torch
# from ultralytics import YOLO
# from Ball import Ball
# from Table import Table
# from Game import Game
# from Constants import Constants
# from video_handler import VideoHandler
# from mini_court import MiniCourt
# from gestureFrameCounter import gestureFrameCounter
# import cv2


# def process_initial_frames(model, video_handler, game):
#     # Use the generator directly
#     results_generator = model.predict(
#         video_handler.get_frame(), stream=True, half=True)

#     for results in results_generator:
#         for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():
#             if score > Constants.THRESHOLD:
#                 if class_id == Constants.TABLE_ID:
#                     # Collect table coordinates for averaging
#                     game.table.sum_table((left_x, top_y), (right_x, bottom_y))
#                 elif class_id == Constants.NET_ID:
#                     # Collect net coordinates for averaging
#                     game.table.sum_net((left_x, top_y), (right_x, bottom_y))

#         # Write the frame to the video and read the next frame for processing
#         video_handler.write_video()
#         Constants.counterUntilFrame += 1
#         video_handler.read_next_frame()


# def process_game_frames(results, video_handler, game, check_hands):
#     best_ball_x_center, best_ball_y_center, best_score_ball = 0, 0, 0
#     right_side, left_side = False, False
#     for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():
#         x_center = (left_x + right_x) // 2
#         y_center = (top_y + bottom_y) // 2

#         if score > Constants.THRESHOLD:
#             if class_id == Constants.Ball_ID:
#                 # Update ball position and speed
#                 if best_score_ball < score:
#                     best_score_ball = score
#                     best_ball_y_center = y_center
#                     best_ball_x_center = x_center
#             elif class_id == Constants.Hand_ID:
#                 # Process hand detections
#                 left_side = game.test_left_hand(
#                     (left_x, top_y), (right_x, bottom_y)) or left_side
#                 right_side = game.test_right_hand(
#                     (left_x, top_y), (right_x, bottom_y)) or right_side
#             video_handler.paint_all(
#                 left_x, top_y, right_x, bottom_y, results.names[int(class_id)], score)
#     if best_score_ball != 0:
#         game.ball.set_coordinates(best_ball_x_center, best_ball_y_center)
#         game.ball.set_speed()
#     check_hands.update(left_side, right_side)


# def main():
#     video_handler = VideoHandler()
#     # Create mini_court draw
#     mini_court = MiniCourt(VideoHandler.frame)
#     model_path = os.path.join(
#         '.', 'Algorithm', 'train11', 'weights', 'best.pt')  # get the training set
#     # Use CUDA if possible
#     device = 'cuda' if torch.cuda.is_available() else 'cpu'
#     print(f'Using device: {device}')
#     # Set CUDA device if applicable
#     if torch.cuda.is_available():
#         torch.cuda.set_device(0)
#     # * added stream=True for better preference with the RAM
#     model = YOLO(model_path)  # Load a custom model
#     model.to(device=device)
#     check_hands = gestureFrameCounter()
#     game = Game(check_hands)

#     # Process initial frames
#     for i in range(2 * Constants.FPS):
#         process_initial_frames(model, video_handler, game)

#     game.set_game_constants()

#   # Main loop for processing each frame
#     while video_handler.get_ret() and game.is_alive():
#         results_generator = model.predict(
#             video_handler.get_frame(), stream=True, half=True)

#         for results in results_generator:
#             # Process the frame results
#             process_game_frames(results, video_handler, game, check_hands)
#             game.judge(VideoHandler.frame, Constants.counterUntilFrame)
#             video_handler.paint_ball_movement(game)
#             # This needs to be last because it writes the frame
#             video_handler.paint_two_sides_and_zones(game)

#             # Drawing the mini court inside the frame
#             mini_court.draw_mini_court(VideoHandler.frame, game)
#             # Drawing the frame counter at the top left corner
#             video_handler.paint_frame_counter()
#             video_handler.paint_score(game)

#             video_handler.write_video()

#             Constants.counterUntilFrame += 1
#             video_handler.read_next_frame()

#             # Break the inner loop if either condition fails
#             if not (video_handler.get_ret() and game.is_alive()):
#                 break

#     video_handler.release()


# if __name__ == "__main__":
#     cProfile.run('main()', filename='profile_results.prof')


# while video_handler.get_ret():  # until no more frames

#     # start_time = time.time()

#     # max_det=3 in model.predict say how many object i want to detect
#     results = model.predict(video_handler.get_frame())[0]
#     # detect_objects(results, game, video_handler)
#     for left_x, top_y, right_x, bottom_y, score, class_id in results.boxes.data.tolist():  # coordinates, accuracy ,
#         # class_id(like train)
#         xCenter = (left_x + right_x) // 2  # Calculate x-center
#         yCenter = (top_y + bottom_y) // 2  # Calculate y-center
#         if score > Constants.THRESHOLD:
#             if class_id == Constants.TABLE_ID:
#                 # 2 seconds of fixing table coordinates until beginning
#                 if Constants.counterUntilFrame <= 2 * Constants.FPS:

#                     # summing coordinates to calc avg
#                     game.table.sum_table((left_x, top_y), (right_x, bottom_y))

#             if class_id == Constants.NET_ID:
#                 # 2 seconds of fixing table coordinates until beginning
#                 if Constants.counterUntilFrame <= 2 * Constants.FPS:
#                     game.table.sum_net((left_x, top_y), (right_x, bottom_y))

#             if class_id == Constants.Ball_ID:
#                 # adding new coordinates to the list
#                 game.ball.set_coordinates(xCenter, yCenter)

#                 game.ball.set_speed()
#                 # etai moved it here from the same indentation as the if classes conditions i.e. one after the if
#                 # threshold.
#                 video_handler.paint_ball_movement(game)

#                 # checks if there was a bounce and determine the rest of the
#                 #! this line testing the rules where we identify ball.
#                 game.test_frame(video_handler.get_frame(),
#                                 Constants.counterUntilFrame, )

#             if class_id == Constants.Hand_ID:
#                 left_side = game.test_left_hand(
#                     (left_x, top_y), (right_x, bottom_y))
#                 right_side = game.test_right_hand(
#                     (left_x, top_y), (right_x, bottom_y))
#                 check_hands.update(left_side, right_side)
#                 if (check_hands):
#                     print(
#                         f"the time its true is {Constants.counterUntilFrame}")

#                 #                                 Constants.counterUntilFrame)
#                 # left_side = game.test_left_hand((left_x, top_y), (right_x, bottom_y),
#                 #                                 Constants.counterUntilFrame)
#                 # x = check_hands.update(
#                 #     left_side, right_side, Constants.counterUntilFrame)
#                 # if x:
#                 #     print(Constants.counterUntilFrame)

#     # ? this draw every object that yolo detect
#     video_handler.paint_all(left_x, top_y, right_x,
#                             bottom_y, results.names[int(class_id)], score)

#     # * setting the position of table after calculating avg of coordinates
#     if Constants.counterUntilFrame == 2 * Constants.FPS:
#         game.set_game_constants()

#     # todo showing the result of the live game right now its not working good.
#     # video_handler.draw_result()

#     # * this need to be last because at the end there is self.out.write(self.frame)
#     video_handler.paint_two_sides_and_zones(game)

#     # * drawing the mini court inside the frame.
#     mini_court.draw_mini_court(VideoHandler.frame, game)
#     # * drawing the frame counter at the top left corner.
#     video_handler.paint_frame_counter()
#     # put this line in comment after finishing

#     # * write the frame to the video this function must be last!.
#     video_handler.write_video()
#     # elapsed_time_ms = (time.time() - start_time) * 1000
#     Constants.counterUntilFrame += 1

#     video_handler.read_next_frame()

# video_handler.release()
