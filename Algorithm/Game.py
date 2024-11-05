from turtle import left
import cv2
from Constants import *
from video_handler import VideoHandler
from Ball import Ball
from Table import Table

# aaa


class Game:
    def __init__(self, ball: Ball, table: Table):
        self.min_height = (
            0  # put zeero becuase its the maximum i.e the top of the frame
        )
        self.ball = ball
        self.table = table
        self.min_duration = 5
        self.starting_point = None
        self.starting_point_right = None
        self.starting_point_left = None
    # def get_ball(self):
    #     return self.ball
    #
    # def set_ball(self, new_ball):
    #     self.ball = new_ball
    #
    # def get_table(self):
    #     return self.table
    #
    # def set_table(self, new_table):
    #     self.table = new_table

    def double_bounce(self, frame, counter):
        if len(self.ball.positions) < 3:
            return
        #  checks that the second last is the minimum of its neighbors (y coordinate only)
        if (
            self.ball.positions[-1].y < self.ball.positions[-2].y
            and self.ball.positions[-2].y > self.ball.positions[-3].y
        ):
            # checks if x coordinate is in the left table
            left_table_x = (
                self.table.left_table[2]
                > self.ball.positions[-2].x
                > self.table.left_table[0]
            )

            # checks if y coordinate is the same as height of the table
            left_on_table_y = (
                self.table.left_table[1] - Constants.EPSILON < self.ball.positions[-2].y < self.table.left_table[3])

            if left_table_x and left_on_table_y:  # if ball hits left table
                # indicates ball hits table
                self.ball.positions[-2].set_vertical()
                # we only need the x value to draw it in the table. we use it as a list of all the points that hit the table.
                self.ball.add_hit(
                    (self.ball.positions[-2].x, self.ball.positions[-2].y)
                )

                self.ball.left_counter += 1  # ball hits left table one more time

                # ball hits twice in the same table - means losing the game
                if (self.ball.left_counter > 1):
                    cv2.putText(frame, f" player right won and the counter is {counter}", (int(100), int(500)),
                                cv2.FONT_HERSHEY_SIMPLEX,  1.0, Color.BLUE, 3, cv2.LINE_AA,)
                    Constants.R_RESULT += 1
            # checks if x coordinate is in the right table
            right_table_x = (
                self.table.right_table[2]
                > self.ball.positions[-2].x
                > self.table.right_table[0]
            )
            # checks if y coordinate is the same as height of the table
            right_on_table_y = (
                self.table.right_table[1] - Constants.EPSILON
                < self.ball.positions[-2].y
                < self.table.right_table[3]
            )
            if right_table_x and right_on_table_y:  # if ball hits right table
                # indicates ball hits table
                self.ball.positions[-2].set_vertical()
                # we only need the x value to draw it in the table. we use it as a list of all the points that hit the table.
                self.ball.add_hit(
                    (self.ball.positions[-2].x, self.ball.positions[-2].y)
                )
                self.ball.right_counter += 1  # ball hits right table one more time
                if (
                    self.ball.right_counter > 1
                ):  # ball hits twice in the same table - means losing the game

                    cv2.putText(
                        frame,
                        f" player left won and the counter is {counter}",
                        (int(800), int(800)),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1.0,
                        Color.RED,
                        2,
                        cv2.LINE_AA,
                    )
                    Constants.L_RESULT += 1

    def hit_table_point(self, frame):
        # dont think we need it
        if len(self.ball.positions) < 3:
            return
        # this purpule line is where we put the min height param.
        cv2.line(
            frame,
            (int(self.min_height), int(self.min_height)),
            (int(self.min_height) + 500, int(self.min_height)),
            Color.PURPLE,
            2,
        )
        cv2.putText(
            frame,
            f" min height is {self.min_height}",
            (int(self.min_height - 10), int(self.min_height - 10)),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.0,
            Color.AQUA,
            5,
            cv2.LINE_AA,
        )

        if self.ball.get_y() > self.min_height:

            # that mean that the last frame the ball is very low  we assume the other player cant touch it.
            if self.ball.left_counter > 0:

                cv2.putText(
                    frame,
                    f" player right won in hit table point",
                    (int(230), int(150)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.0,
                    Color.MAGENTA,
                    5,
                    cv2.LINE_AA,
                )
                # adding 1 to the right player
                Constants.R_RESULT += 1
            elif self.ball.right_counter > 0:
                cv2.putText(
                    frame,
                    f" player left won in hit table point",
                    (int(300), int(700)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.0,
                    Color.MAGENTA,
                    5,
                    cv2.LINE_AA,
                )
                # adding 1 to the left player
                Constants.L_RESULT += 1

    def hit_floor_first(self, frame):
        # dont think we need it
        if len(self.ball.positions) < 3:
            return

        if self.ball.get_y() > self.min_height:
            # checks if x coordinate is in the left table
            left_table_x = (
                self.table.left_table[2]
                > self.ball.positions[-2].x
                > self.table.left_table[0]
            )
            right_table_x = (
                self.table.right_table[2]
                > self.ball.positions[-2].x
                > self.table.right_table[0]
            )
            if (
                self.ball.left_counter == 0 and left_table_x
            ):  # meaning that the x is in the table area and there is
                # no hitting in the left area the conclusion is that the right player miss

                cv2.putText(
                    frame,
                    f" player left won  in hit floor point {self.ball.get_y()}",
                    (int(130), int(150)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.0,
                    Color.ORANGE,
                    5,
                    cv2.LINE_AA,
                )
                Constants.L_RESULT += 1
                print(
                    f"player left won in hit floor point {self.ball.get_y()}")
            # meaning that the x is in the table area and there is
            elif self.ball.right_counter == 0 and right_table_x:
                # no hitting in the right area the conclusion is that the left player miss

                cv2.putText(
                    frame,
                    f" player right won in hit floor point {self.ball.get_y()}",
                    (int(600), int(700)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.0,
                    Color.ORANGE,
                    5,
                    cv2.LINE_AA,
                )
                Constants.R_RESULT += 1
                # print(
                #     f"player right won in hit floor point {self.ball.get_y()}")

    def set_game_constants(self):
        self.table.set_coordinates_table()
        self.table.set_coordinates_net()
        self.table.set_two_sides()
        self.table.set_touch_zones()
        self.ball.net_x = self.table.netlist[0]
        # this is the minimum value that we expect someone to hit the ball. i.e lower than this is a point to the
        # opponent.
        # we need to think about good min height because its very important attribute
        # self.min_height = (4 * self.table.list[1] + self.table.list[3]) / 5  # average
        self.min_height = int(
            (7 * self.table.list[1] + 3 * self.table.list[3]) / 10)  # calculating the min height when we assume player cant return the ball

    def test_frame(self, frame, counter):
        self.ball.set_side_of_table()
        self.hit_table_point(frame)
        self.hit_floor_first(frame)
        # i think this function need to called last  because only here i change the left and right counting but im not sure about it yet.
        self.double_bounce(frame, counter)

        # need to create here function that checks if the ball hit the table and now he is lower than something we can say its a point to the other side
        # todo: somehow to check if the player touch the ball before its hits the table.
        # todo: identify if its a server or not
        # todo: identify when point is ending
        # todo: maybe to use threads on each function that being called in test_frame

    def test_hands(self, left_point, right_point, counter):

        x_center = (left_point[0] + right_point[0]) / 2
        y_center = (left_point[1] + right_point[1]) / 2

        # Check if the condition is true
        hands_in_right_side = (
            (self.table.right_zone[0] <= x_center <= self.table.right_zone[2])
            and (self.table.right_zone[1] <= y_center <= self.table.right_zone[3])
        )
        hands_in_left_side = (
            (self.table.left_zone[0] <= x_center <= self.table.left_zone[2])
            and (self.table.left_zone[1] <= y_center <= self.table.left_zone[3])
        )

        if hands_in_right_side or hands_in_left_side:
            if self.starting_point is None:
                # Start a new sequence
                self.starting_point = counter  # Set the starting point

        else:
            if self.starting_point is not None:
                # The condition was true but has now ended, so print the interval
                duration = counter - self.starting_point
                if duration > self.min_duration:
                    print(f"Condition was true from {self.starting_point} to {counter} "
                          f"(duration: {duration} seconds)")
                # Reset the tracking variables for the next sequence
                self.starting_point = None

    def test_right_hand(self, left_point, right_point, counter):
        x_center = (left_point[0] + right_point[0]) / 2
        y_center = (left_point[1] + right_point[1]) / 2

    # Check if the right-hand condition is true
        hands_in_right_side = (
            (self.table.right_zone[0] <= x_center <= self.table.right_zone[2])
            and (self.table.right_zone[1] <= y_center <= self.table.right_zone[3])
        )

        if hands_in_right_side:
            if self.starting_point_right is None:
                # Start a new sequence
                self.starting_point_right = counter  # Set the starting point for right-hand zone

        else:
            if self.starting_point_right is not None:
                # The right-hand condition was true but has now ended, so calculate duration
                duration = counter - self.starting_point_right
                if duration > self.min_duration:
                    print(f"Right hand condition was true from {self.starting_point_right} to {counter} "
                          f"(duration: {duration} seconds)")
                # Reset the tracking variables for the next sequence
                self.starting_point_right = None

    def test_left_hand(self, left_point, right_point, counter):
        x_center = (left_point[0] + right_point[0]) / 2
        y_center = (left_point[1] + right_point[1]) / 2

        # Check if the left-hand condition is true
        hands_in_left_side = (
            (self.table.left_zone[0] <= x_center <= self.table.left_zone[2])
            and (self.table.left_zone[1] <= y_center <= self.table.left_zone[3])
        )

        if hands_in_left_side:
            if self.starting_point_left is None:
                # Start a new sequence
                self.starting_point_left = counter  # Set the starting point for left-hand zone

        else:
            if self.starting_point_left is not None:
                # The left-hand condition was true but has now ended, so calculate duration
                duration = counter - self.starting_point_left
                if duration > self.min_duration:
                    print(f"Left hand condition was true from {self.starting_point_left} to {counter} "
                          f"(duration: {duration} seconds)")
                # Reset the tracking variables for the next sequence
                self.starting_point_left = None

    # def ball_is_out(self):
    #     if self.ball.positions[-1].y > self.min_height:
    #         if self.count_left == 1:
    #             print("player right won ")

    #         elif self.count_right == 1:
    #             print("player left won")
