

import cv2
# from Algorithm import GameStats
from gestureFrameCounter import gestureFrameCounter
from game_status import GameStatus
from Constants import *
from Ball import Ball
from Table import Table
from TrackScore import TrackScore
from GameStats import GameStats
# aaa

##! the convention is ({true- violation in the game or false- point still active without violation},{if there was violation who won it})
##! for example (true,left_player) , (false,)


# todo: ליצור פונקציה שבודקת אם הכדור נעלם למשך של יותר מ2 שניות אחרי פגיעה בשולחן מסוים זה אומר שהשחקן שהפגיעה האחרונה בשולחן שלו הפסיד
# todo:     לטפל בכל מה שקשור לסרבים עשינו אבל לא בדקנו עם עובד עדיין


class Game:
    def __init__(self, check_hands: gestureFrameCounter, player_names):
        self.min_height = 0  # put zero because its the maximum i.e the top of the frame
        self.ball = Ball()
        self.table = Table()
        self.game_stats = GameStats(player_names)
        self.track_score = TrackScore()
        self.check_hands = check_hands
        self.legal_serve = True
        self.last_frame_ball_seen_bounce = 0
        self.game_status = GameStatus(self.wait_for_hand, self.wait_for_fault)
        self.last_judge_point = None
        self.last_side_hitter = Constants.LEFT_PLAYER
        # self.game_stats = GameStats(player_names)

        # self.min_duration = 20
        # self.starting_point = None
        # self.starting_point_right = None
        # self.starting_point_left = None

    def is_alive(self):
        # if its false
        return not self.track_score.get_status()[0]

    def judge(self, frame, counter):
        # this is the arguments that the function will get
        (self.game_status.get_function())(frame, counter)

    def double_bounce(self, frame, counter):
        if len(self.ball.positions) < 3:
            return False,
        #  checks that the second last is the minimum of its neighbors (y coordinate only)
        if (self.ball.positions[-1].y < self.ball.positions[-2].y and self.ball.positions[-2].y > self.ball.positions[-3].y):
            # checks if x coordinate is in the left table
            left_table_x = (
                self.table.left_table[2] > self.ball.positions[-2].x > self.table.left_table[0])
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
                self.game_stats.set_areas_of_hits(
                    self.last_side_hitter, self.ball.positions[-2].x, self.table.quarters_intervals)
                self.last_frame_ball_seen_bounce = Constants.counterUntilFrame - \
                    1  # because we find the "min" one frame after

                self.ball.left_counter += 1  # ball hits left table one more time

                # ball hits twice in the same table - means losing the game
                if self.ball.left_counter > 1:
                    cv2.putText(frame, f" player right won and the counter is {counter}", (int(
                        100), int(500)), cv2.FONT_HERSHEY_SIMPLEX, 1.0, Color.BLUE,  3, cv2.LINE_AA,)
                    Constants.R_RESULT += 1
                    return (True, Constants.RIGHT_PLAYER)
            # checks if x coordinate is in the right table
            right_table_x = (
                self.table.right_table[2] > self.ball.positions[-2].x > self.table.right_table[0])
            # checks if y coordinate is the same as height of the table
            right_on_table_y = (
                self.table.right_table[1] - Constants.EPSILON < self.ball.positions[-2].y < self.table.right_table[3])
            if right_table_x and right_on_table_y:  # if ball hits right table
                # indicates ball hits table
                self.ball.positions[-2].set_vertical()
                # we only need the x value to draw it in the table. we use it as a list of all the points that hit the table.
                self.ball.add_hit(
                    (self.ball.positions[-2].x, self.ball.positions[-2].y))
                self.game_stats.set_areas_of_hits(self.last_side_hitter, self.ball.positions[-2].x,
                                                  self.table.quarters_intervals)
                self.last_frame_ball_seen_bounce = Constants.counterUntilFrame-1
                self.ball.right_counter += 1  # ball hits right table one more time
                # self.check_last_ball_seen = Constants.counterUntilFrame

                # ball hits twice in the same table - means losing the game
                if (self.ball.right_counter > 1):
                    cv2.putText(frame, f" player left won and the counter is {counter}", (int(
                        800), int(800)), cv2.FONT_HERSHEY_SIMPLEX, 1.0, Color.RED, 2, cv2.LINE_AA,)
                    print(f"______________ player left won {counter}")
                    Constants.L_RESULT += 1
                    return (True, Constants.LEFT_PLAYER)
        return (False,)

    def hit_table_point(self, frame):
        # dont think we need it
        if len(self.ball.positions) < 3:
            return (False,)
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

                return (True, Constants.RIGHT_PLAYER)
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

                return (True, Constants.LEFT_PLAYER)
        return False,

    def set_game_constants(self):
        self.table.set_coordinates_table()
        self.table.set_coordinates_net()
        self.table.set_two_sides()
        self.table.set_touch_zones()
        self.table.set_intervals()
        # self.ball.net_x = self.table.netlist[0]
        # this is the minimum value that we expect someone to hit the ball. i.e lower than this is a point to the
        # opponent.
        # we need to think about good min height because its very important attribute
        # self.min_height = (4 * self.table.list[1] + self.table.list[3]) / 5  # average
        self.min_height = int(
            (7 * self.table.list[1] + 3 * self.table.list[3]) / 10
        )  # calculating the min height when we assume player cant return the ball

    def wait_for_fault(self, frame, counter):
        # self.bounce_on_serve_side()
        # if not self.legal_serve:
        #     print("_____________________________im here ")
        #     # the player who did the serve lost the point. so we update the winner to be the other player.
        #     self.game_status.next_state()
        #     return self.track_score.update_score((self.track_score.get_server()+1) % 2)

        # * if the length is zero we dont need to do anything so return false
        if len(self.ball.positions) == 0:
            return (False,)

        # here we need to call check_last_ball_seen to check more than 2 *fps before checking if it is the same frame!!

        clbs = self.check_last_ball_seen()
        if clbs[0]:
            Constants.WON_REASON = "check_last_ball_seen in right table"
            self.game_status.next_state()
            self.game_stats.set_after_ball_out_zone(
                self.last_side_hitter, clbs[1])
            return self.track_score.update_score(clbs[1])

            # * if the last location of the ball is different change it. if its the same, return false as we dont need to change anything about the score.
        if (len(self.ball.positions) > 0 and self.ball.positions[-1] != self.last_judge_point):
            self.last_judge_point = self.ball.positions[-1]
        else:
            return (False,)

        self.ball.set_side_of_table()

        # update the who hit the ball last
        if self.ball.bounce_horizontal(self.last_side_hitter, self.table.quarters_intervals):
            # this change to the other player.
            self.game_stats.curr_mini_game_hits += 1
            self.last_side_hitter = (self.last_side_hitter+1) % 2

        # this is the functions that judge the game
        htp = self.hit_table_point(frame)
        if htp[0]:
            Constants.WON_REASON = "hit table_point"
            self.game_status.next_state()
            self.game_stats.set_after_ball_out_zone(
                self.last_side_hitter, htp[1])
            return self.track_score.update_score(htp[1])
        # ? do not use it now because this function is not working properly
        # hff = self.hit_floor_first(frame)
        # if hff[0]:
        #     return self.track_score.update_score(hff[1])

        # i think this function need to called last  because only here i change the left and right counting but im not sure about it yet.
        db = self.double_bounce(frame, counter)

        if db[0]:
            Constants.WON_REASON = "double_bounce"
            self.game_status.next_state()
            self.game_stats.set_after_double_bounce(db[1])
            return self.track_score.update_score(db[1])
        return (False,)

    def bounce_on_serve_side(self):
        if len(self.ball.get_hit_positions()) == 1:
            # comparing the x values from the get hits positions
            print(f"___________________{self.ball.get_hit_positions()[0]}")
            in_left_side = self.table.left_table[0] <= self.ball.get_hit_positions()[
                0][0] <= self.table.left_table[2]

            in_right_side = self.table.right_table[0] <= self.ball.get_hit_positions()[
                0][0] <= self.table.right_table[2]
            if (self.track_score.get_server() == Constants.LEFT_PLAYER):
                self.legal_serve = in_left_side
            else:
                self.legal_serve = in_right_side

    # def test_hands(self, left_point, right_point, counter):

    #     x_center = (left_point[0] + right_point[0]) / 2
    #     y_center = (left_point[1] + right_point[1]) / 2

    #     # Check if the condition is true
    #     hands_in_right_side = (
    #         self.table.right_zone[0] <= x_center <= self.table.right_zone[2]
    #     ) and (self.table.right_zone[1] <= y_center <= self.table.right_zone[3])
    #     hands_in_left_side = (
    #         self.table.left_zone[0] <= x_center <= self.table.left_zone[2]
    #     ) and (self.table.left_zone[1] <= y_center <= self.table.left_zone[3])

    #     if hands_in_right_side or hands_in_left_side:
    #         if self.starting_point is None:
    #             # Start a new sequence
    #             self.starting_point = counter  # Set the starting point

    #     else:
    #         if self.starting_point is not None:
    #             # The condition was true but has now ended, so print the interval
    #             duration = counter - self.starting_point
    #             if duration > self.min_duration:
    #                 print(
    #                     f"Condition was true from {self.starting_point} to {counter} "
    #                     f"(duration: {duration} seconds)"
    #                 )
    #             # Reset the tracking variables for the next sequence
    #             self.starting_point = None

    def test_right_hand(self, left_point, right_point):
        x_center = (left_point[0] + right_point[0]) / 2
        y_center = (left_point[1] + right_point[1]) / 2

        # Check if the right-hand condition is true
        hands_in_right_side = (
            self.table.right_zone[0] <= x_center <= self.table.right_zone[2]
        ) and (self.table.right_zone[1] <= y_center <= self.table.right_zone[3])
        if (hands_in_right_side):
            print("_________________________________inside test frame")
        return hands_in_right_side

        # region Comment Block
        if self.starting_point_right is None:
            # Start a new sequence
            self.starting_point_right = (
                counter  # Set the starting point for right-hand zone
            )

        else:
            if self.starting_point_right is not None:
                # The right-hand condition was true but has now ended, so calculate duration
                duration = counter - self.starting_point_right
                if duration > self.min_duration:
                    print(
                        f"Right hand condition was true from {self.starting_point_right} to {counter} "
                        f"(duration: {duration} seconds)"
                    )
                # Reset the tracking variables for the next sequence
                self.starting_point_right = None
        # endregion

    def test_left_hand(self, left_point, right_point):

        x_center = (left_point[0] + right_point[0]) / 2
        y_center = (left_point[1] + right_point[1]) / 2

        # Check if the left-hand condition is true
        hands_in_left_side = (
            self.table.left_zone[0] <= x_center <= self.table.left_zone[2]
        ) and (self.table.left_zone[1] <= y_center <= self.table.left_zone[3])
        if hands_in_left_side:
            print("_________________________________inside test frame left")
        return hands_in_left_side

    def wait_for_hand(self, frame, counter):
        # check that the hand was enough time in the zone
        if self.check_hands.get_current():
            self.game_status.next_state()
            # * we are starting a new point and instead of reset every field of ball we just create new ball .
            self.ball = Ball()
            self.last_judge_point = None

            self.last_side_hitter = self.track_score.get_server()

    def check_last_ball_seen(self):
        # if there is more 2 seconds from the last we saw the ball and its a fault so we need to update the score.
        if (Constants.counterUntilFrame-self.last_frame_ball_seen_bounce > 2.5*Constants.FPS):
            if len(self.ball.get_hit_positions()) == 0:
                return (False,)
            x_coordinate = self.ball.get_hit_positions()[-1][0]
            if (self.table.left_table[0] <= x_coordinate <= self.table.left_table[2]):

                print(
                    f"inside the check_last_ball_seen1 {Constants.counterUntilFrame} ")
                return (True, Constants.RIGHT_PLAYER)
            print(
                f"inside the check_last_ball_seen2 {Constants.counterUntilFrame} ")

            # its in the right side so left is the winner
            return (True, Constants.LEFT_PLAYER)
        # nothing happened
        return (False,)

        # region Comment Block
        # if hands_in_left_side:
        #     if self.starting_point_left is None:
        #         # Start a new sequence
        #         self.starting_point_left = counter  # Set the starting point for left-hand zone

        # else:
        #     if self.starting_point_left is not None:
        #         # The left-hand condition was true but has now ended, so calculate duration
        #         duration = counter - self.starting_point_left
        #         if duration > self.min_duration:
        #             print(f"Left hand condition was true from {self.starting_point_left} to {counter} "
        #                   f"(duration: {duration} seconds)")
        #         # Reset the tracking variables for the next sequence
        #         self.starting_point_left = None
        # endregion

        # def ball_is_out(self):
        #     if self.ball.positions[-1].y > self.min_height:
        #         if self.count_left == 1:
        #             print("player right won ")

        #         elif self.count_right == 1:
        #             print("player left won")
