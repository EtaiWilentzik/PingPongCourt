import os
import cv2

from Constants import *


class VideoHandler:
    # change frame to static variable because we dont need to create object for him in mini court to just get the frame.
    frame = None

    def __init__(self, video_path):
        # Absolute path is directly used
        self.video_path = video_path
        # Output file with `_out` appended
        self.video_path_out = f"{os.path.splitext(self.video_path)[0]}_out.mp4"

        # Open video using cv2
        self.cap = cv2.VideoCapture(self.video_path)
        if not self.cap.isOpened():
            raise ValueError(
                f"Failed to open video at path: {self.video_path}. Please check the video path.")

        # Get FPS from video
        Constants.FPS = int(self.cap.get(cv2.CAP_PROP_FPS))
        print("The FPS is", Constants.FPS)

        # Read the first frame
        self.ret, self.frame = self.cap.read()
        if self.ret:
            VideoHandler.frame = self.frame  # Update static frame
            self.H, self.W, _ = self.frame.shape  # Dimensions of the frame
        else:
            raise ValueError(
                "Failed to read the first frame. Please check the video file.")

        # Prepare output writer
        self.out = cv2.VideoWriter(
            self.video_path_out,
            cv2.VideoWriter_fourcc(*'H264'),
            Constants.FPS,
            (self.W, self.H)
        )

    def get_ret(self):
        return self.ret

    def get_top_right_corner(self):
        return (self.W - 1, 0)

    def paint_two_sides_and_zones(self, game):
        cv2.rectangle(VideoHandler.frame, (int(game.table.left_table[0]), int(game.table.left_table[1])),
                      (int(game.table.left_table[2]), int(game.table.left_table[3])), Color.BROWN, 4)
        cv2.rectangle(VideoHandler.frame, (int(game.table.right_table[0]), int(game.table.right_table[1])),
                      (int(game.table.right_table[2]), int(game.table.right_table[3])), Color.PINK, 4)

        # painting the 2 touch zones.

        cv2.rectangle(VideoHandler.frame, (int(game.table.left_zone[0]), int(game.table.left_zone[1])),
                      (int(game.table.left_zone[2]), int(game.table.left_zone[3])), Color.GREEN, 4)

        cv2.rectangle(VideoHandler.frame, (int(game.table.right_zone[0]), int(game.table.right_zone[1])),
                      (int(game.table.right_zone[2]), int(game.table.right_zone[3])), Color.GREEN, 4)
        self.paint_interval_lines(game)

    def paint_interval_lines(self, game):
        for i in range(8):
            curr_x = int(game.table.quarters_intervals[i][0])
            cv2.line(VideoHandler.frame, (curr_x, int(game.table.left_table[1])),
                     (curr_x, int(game.table.bottom_net[1])), Color.RED, 2)

    def paint_frame_counter(self):
        cv2.putText(VideoHandler.frame, f"Frame number: {Constants.counterUntilFrame}",
                    (10, 30), cv2.FONT_HERSHEY_PLAIN,  2, Color.BLUE, 2)

    def paint_score(self, game):
        cv2.putText(VideoHandler.frame, f"Score: {game.track_score.get_score()}",
                    (100, 100), cv2.FONT_HERSHEY_PLAIN,  3, Color.BLUE, 2)
        if game.game_status.state == 1:
            cv2.putText(VideoHandler.frame, "state of game: judging the current point",
                        (700, 100), cv2.FONT_HERSHEY_PLAIN,  2, Color.RED, 2)
        else:
            cv2.putText(VideoHandler.frame, f"state of game: between points",
                        (1300, 100), cv2.FONT_HERSHEY_PLAIN, 2, Color.BLACK, 2)

        cv2.putText(VideoHandler.frame, f"Reason for last point: {Constants.WON_REASON}",
                    (1300, 130), cv2.FONT_HERSHEY_PLAIN,  2, Color.BLACK, 2)

    def write_video(self):
        self.out.write(VideoHandler.frame)

    def read_next_frame(self):
        # print(f"Elapsed time: {elapsed_time_ms} milliseconds")
        self.ret, VideoHandler.frame = self.cap.read()

    def get_frame(self):
        return VideoHandler.frame

    def paint_ball_movement(self, game):
        tmp_positions = game.ball.get_positions()
        for i, pos in enumerate(tmp_positions):
            if pos.is_vertical():
                cv2.circle(VideoHandler.frame, (pos.x, pos.y),
                           25, Color.RED, cv2.FILLED)
            else:
                cv2.circle(VideoHandler.frame, (pos.x, pos.y),
                           5, Color.GREEN, cv2.FILLED)
                # draw line between each frame.
            if i != 0:
                cv2.line(VideoHandler.frame, (pos.x, pos.y), (tmp_positions[i - 1].x, tmp_positions[i - 1].y),
                         Color.BLACK,
                         2)
        print(" i am hereeeeeee")

    def paint_all(self, x1, y1, x2, y2, result, confidence):
        # Shows confidence with 2 decimal places
        label = f"{result} ({confidence:.2f})"
        if result != "Hand_Racket" and result != "Net" and result != "Table":
            # if result == "Hand_Ball":
            #     cv2.rectangle(self.frame, (int(x1), int(y1)),
            #                   (int(x2), int(y2)), Color.ORANGE, 4)
            # else:
            #     cv2.rectangle(self.frame, (int(x1), int(y1)),
            #                   (int(x2), int(y2)), Color.GREEN, 4)
            if result == "Hand":
                cv2.rectangle(self.frame, (int(x1), int(y1)),
                              (int(x2), int(y2)), Color.GREEN, 4)
                cv2.circle(self.frame, (int((x1 + x2) / 2),
                           int((y1 + y2) / 2)), 5, Color.LIME, 4)

            cv2.putText(self.frame, label, (int(x1), int(y1 - 10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.3, Color.GREEN, 3, cv2.LINE_AA, )

    # draw live result of the game
    def draw_result(self):
        top_right = self.get_top_right_corner()
        # Coordinates for the rectangle
        top_left_x = top_right[0] / 2 - 250
        top_left_y = top_right[1]
        bottom_right_x = top_right[0]
        bottom_right_y = top_left_y + 250

        # Draw the rectangle
        cv2.rectangle(VideoHandler.frame, (int(top_left_x), int(top_left_y)),
                      (int(bottom_right_x), int(bottom_right_y)),  Color.BLACK, -1)  # -1 is for fill the rectangle

        cv2.putText(VideoHandler.frame, f"Left {Constants.L_RESULT} - Right {Constants.R_RESULT}", (int(
            top_left_x) + 30, int(top_left_y) + 30), cv2.FONT_HERSHEY_SIMPLEX, 1.0, Color.AQUA, 5, cv2.LINE_AA, )

    def release(self):
        self.cap.release()
        self.out.release()
        cv2.destroyAllWindows()
