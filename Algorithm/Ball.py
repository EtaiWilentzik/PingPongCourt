from ast import Return
import math
from Constants import *
from formulas import calculate_linear_distance


class Ball:
    def __init__(self):
        # list of (x, y, is_bounce_vertical, is_bounce_horizontal)
        self.positions = []
        self.hit_positions = []
        self.left_counter = 0
        self.right_counter = 0
        self.opposite_direction_count = 0
        # maybe we will use it for statistics or max speed of interval something like that
        self.speeds = []
        self.last_seen_frame = 0

    # add new coordinates of ball in new frame
    def set_coordinates(self, x, y):
        if len(self.positions) >= 30:
            self.positions.pop(0)
        self.positions.append(Position(x, y))

    def calc_scaling_factor(self):
        print("calculating scaling factor")

    def set_speed(self, frame, game_stats,table):
        print("the length is",table.length)
        if len(self.positions) < 2:
            return
        print("the frame is", frame)
        if frame != (self.last_seen_frame + 1):
            self.last_seen_frame = frame
            return
        print("the frame is", frame, "the last frame is", self.last_seen_frame)
        self.last_seen_frame = frame
        speed = (274 / table.length) * calculate_linear_distance(
            (self.positions[-1].x, self.positions[-1].y),
            (self.positions[-2].x, self.positions[-2].y))
        speed *= Constants.FPS  # how many cm/sec
        speed *= 0.036
        # means ball is moving from left to right
        if self.positions[-1].x > self.positions[-2].x:
            if speed > game_stats.player_left.fastest_ball_speed:
                game_stats.player_left.fastest_ball_speed = speed
                game_stats.player_left.fastest_ball_frame = frame
        else:
            if speed > game_stats.player_right.fastest_ball_speed:
                game_stats.player_right.fastest_ball_speed = speed
                game_stats.player_right.fastest_ball_frame = frame

        print("the speed is", speed)

    # this function determine in which side of the table the ball is

    def set_side_of_table(self):
        if len(self.positions) > 0:
            # check side of ball
            if self.positions[-1].x > Constants.NET_X:
                self.left_counter = 0
            else:
                self.right_counter = 0

    def get_positions(self):
        return self.positions

    def get_hit_positions(self):
        return self.hit_positions

    def get_x(self):
        return self.positions[-1].x

    def get_y(self):
        return self.positions[-1].y

    def bounce_horizontal(self, current_last_side_hitter, ranges):
        # we want to obtaion the oposite dircation that why we want to count "mistake "
        Allowed_time = 2
        if len(self.positions) < 2:
            return False
        if current_last_side_hitter == Constants.LEFT_PLAYER:
            if self.positions[-2].x > self.positions[-1].x > ranges[4][0]:
                self.opposite_direction_count += 1
            else:
                self.opposite_direction_count = 0
        elif current_last_side_hitter == Constants.RIGHT_PLAYER:
            if self.positions[-2].x < self.positions[-1].x < ranges[4][0]:
                self.opposite_direction_count += 1
            else:
                self.opposite_direction_count = 0
        if self.opposite_direction_count == Allowed_time:
            print(
                f"______________________ in bounce horizontal and true {Constants.counterUntilFrame}")
            return True
        return False

        # if len(self.positions) > 2:

        #     # check direction of last 2 frames
        #     d_last = self.positions[-1].x - self.positions[-2].x
        #     if d_last < 0:  # if direction is left
        #         if self.direction == Constants.RIGHT:  # if direction was right
        #             # mark as change of directions
        #             self.positions[-2].set_horizontal()
        #         self.direction = Constants.LEFT  # set the direction to left
        #     elif d_last > 0:  # if direction is right
        #         if self.direction == Constants.LEFT:  # if direction was left
        #             # mark as change of directions
        #             self.positions[-2].set_horizontal()
        #         # self.direction = Constants.RIGHT  # set the direction to right

    def add_hit(self, point):

        if len(self.hit_positions) >= 2:
            self.hit_positions.pop(0)
        self.hit_positions.append(point)

    def get_hit_positions(self):
        return self.hit_positions

    # def bounce_vertical(self, table):
    #     if len(self.positions) < 3:
    #         return

    #     # second last position is minimum (y value) of it's neighbors. we need it because if the ball still in the area in the next frame we dont want to count it as two bounces
    #     min_position = self.positions[-1].y < self.positions[-2].y and self.positions[-3].y < self.positions[-2].y

    #     #  checks if the x coordinates is in the table area
    #     x_in_table = table.get_bottom_right()[Constants.X_COORDINATE] > self.positions[-2][0] > table.get_top_left()[
    #         Constants.X_COORDINATE]

    #     #  checks that the second last position is on the table (y coordinates only)
    #     y_on_table = (table.get_top_left()[Constants.Y_COORDINATE] - Constants.EPSILON) < self.positions[-2].y < \
    #         table.get_bottom_right()[Constants.Y_COORDINATE]

    #     if min_position and y_on_table and x_in_table:  # if the ball hits the table
    #         # set the position to indicate vertical change
    #         self.positions[-2].set_vertical()


# position of ball at each frame


class Position:
    def __init__(self, x, y):
        self.x = int(x)
        self.y = int(y)
        self.vertical = False
        self.horizontal = False

    def set_horizontal(self):
        self.horizontal = True

    def set_vertical(self):
        self.vertical = True

    def is_vertical(self):
        return self.vertical

    def get_horizontal(self):
        return self.horizontal
