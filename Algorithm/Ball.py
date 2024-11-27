

from Constants import *
from formulas import calculate_linear_distance


class Ball:
    def __init__(self):
        # list of (x, y, is_bounce_vertical, is_bounce_horizontal)
        self.positions = []
        self.hit_positions = []
        self.left_counter = 0
        self.right_counter = 0
        # we used it to see if the ball jump in the same direction for 2 seconds
        self.opposite_direction_count = 0
        self.last_seen_frame = 0

    # added new coordinates of the ball, according to the frame we are processing.
    def set_coordinates(self, x, y):
        # for making the video more beautiful showing only last 30 locations of the ball.
        if len(self.positions) >= 30:
            self.positions.pop(0)
        self.positions.append(Position(x, y))

    def set_speed(self, frame, game_stats, table):

        if len(self.positions) < 2:
            return
        print("the frame is", frame)
        if frame != (self.last_seen_frame + 1):
            self.last_seen_frame = frame
            return
        self.last_seen_frame = frame
        speed = (Dimensions.OFFICIAL_TABLE_TENNIS_LENGTH / table.length) * calculate_linear_distance(
            (self.positions[-1].x, self.positions[-1].y),
            (self.positions[-2].x, self.positions[-2].y))
        speed *= Constants.FPS  # how many cm/sec
        speed *= Dimensions.cm_per_seconds_to_km_per_hour
        if speed > Dimensions.max_allowed_speed:
            return
        # means ball is moving from left to right
        if self.positions[-1].x > self.positions[-2].x:
            game_stats.player_left.top_speeds.append(speed)
            # take the seven highest speeds.
            game_stats.player_left.top_speeds = sorted(
                game_stats.player_left.top_speeds, reverse=True)[:7]
        else:

            game_stats.player_right.top_speeds.append(speed)
            game_stats.player_right.top_speeds = sorted(
                game_stats.player_right.top_speeds, reverse=True)[:7]

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
    # check if was a change in the direction of the  in one of the sides.

    def bounce_horizontal(self, current_last_side_hitter, ranges):
        # we want to obtain the opposite direction that why we want to count "mistake "
        Allowed_time = 2
        if len(self.positions) < 2:
            return False
        if current_last_side_hitter == Constants.LEFT_PLAYER:
            # if  we suspect that the right player hit the ball last
            if self.positions[-2].x > self.positions[-1].x > ranges[4][0]:
                self.opposite_direction_count += 1
            else:
                self.opposite_direction_count = 0
        elif current_last_side_hitter == Constants.RIGHT_PLAYER:
            # it we suspect the left player hit the ball
            if self.positions[-2].x < self.positions[-1].x < ranges[4][0]:
                self.opposite_direction_count += 1
            else:
                self.opposite_direction_count = 0
        if self.opposite_direction_count == Allowed_time:

            return True
        return False

    def add_hit(self, point):

        if len(self.hit_positions) >= 2:
            self.hit_positions.pop(0)
        self.hit_positions.append(point)

    def get_hit_positions(self):
        return self.hit_positions


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
