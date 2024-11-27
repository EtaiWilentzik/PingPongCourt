
from GameStats import GameStats
from gestureFrameCounter import gestureFrameCounter
from game_status import GameStatus
from Constants import *
from Ball import Ball
from Table import Table
from TrackScore import TrackScore

# * the convention is ({true- violation in the game or false- point still active without violation},{if there was violation who won it})
# * for example (true,left_player) , (false,)


class Game:
    def __init__(self, check_hands: gestureFrameCounter, player_names, starter, game_id):
        self.min_height = 0  # equals zero because its the maximum i.e the top of the frame
        self.ball = Ball()
        self.table = Table()
        self.track_score = TrackScore(starter)
        self.check_hands = check_hands
        self.last_frame_ball_seen_bounce = 0
        self.game_status = GameStatus(self.wait_for_hand, self.wait_for_fault)
        self.last_judge_point = None
        self.last_side_hitter = Constants.LEFT_PLAYER
        self.game_stats = GameStats(player_names, game_id)

    def is_alive(self):
        return not self.track_score.get_status()[0]

    def judge(self, frame, counter):
        # calling the dictionary and sending the params frame and counter.
        (self.game_status.get_function())(frame, counter)

    def double_bounce(self):
        if len(self.ball.positions) < 3:
            return False,
        #  checks that the second last is the minimum of its neighbors (y coordinate only)
        if (self.ball.positions[-1].y < self.ball.positions[-2].y and self.ball.positions[-2].y > self.ball.positions
                [-3].y):
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
                self.last_frame_ball_seen_bounce = Constants.counterUntilFrame - 1
                # because we find the "min" one frame after

                self.ball.left_counter += 1  # ball hits left table one more time

                # ball hits twice in the same table - means losing the game
                if self.ball.left_counter > 1:
                    Constants.R_RESULT += 1
                    return (True, Constants.RIGHT_PLAYER)
            # checks if x coordinate is in the right table
            right_table_x = (
                self.table.right_table[2] > self.ball.positions[-2].x > self.table.right_table[0])
            # checks if y coordinate is the same as height of the table
            right_on_table_y = (
                self.table.right_table[1] -
                Constants.EPSILON < self.ball.positions[-2].y < self.table.right_table
                [3])
            if right_table_x and right_on_table_y:  # if ball hits right table
                # indicates ball hits table
                self.ball.positions[-2].set_vertical()
                # we only need the x value to draw it in the table. we use it as a list of all the points that hit the table.
                self.ball.add_hit(
                    (self.ball.positions[-2].x, self.ball.positions[-2].y))

                self.game_stats.set_areas_of_hits(self.last_side_hitter, self.ball.positions[-2].x,
                                                  self.table.quarters_intervals)
                self.last_frame_ball_seen_bounce = Constants.counterUntilFrame - 1
                self.ball.right_counter += 1  # ball hits right table one more time

                # ball hits twice in the same table - means losing the game
                if (self.ball.right_counter > 1):
                    Constants.L_RESULT += 1
                    return (True, Constants.LEFT_PLAYER)
        return (False,)
    # this is the case  where one player hit the ball and the ball is under the min height.

    def hit_table_point(self):
        if len(self.ball.positions) < 3:
            return (False,)
        if self.ball.get_y() > self.min_height:

            # that mean that the last frame the ball is very low  we assume the other player cant touch it.
            if self.ball.left_counter > 0:
                return (True, Constants.RIGHT_PLAYER)
            elif self.ball.right_counter > 0:
                return (True, Constants.LEFT_PLAYER)
        return False,

    def set_game_constants(self):
        self.table.set_coordinates_table()
        self.table.set_coordinates_net()
        self.table.set_two_sides()
        self.table.set_touch_zones()
        self.table.set_intervals()
        self.table.set_length()
        # this is the minimum value that we expect someone to hit the ball. i.e lower than this is a point to the opponent.
        self.min_height = int(
            (7 * self.table.list[1] + 3 * self.table.list[3]) / 10)

    def wait_for_fault(self, frame, counter):
        # * if the length is zero we dont need to do anything so return false
        if len(self.ball.positions) == 0:
            return (False,)
        self.ball.set_speed(int(Constants.counterUntilFrame),
                            self.game_stats, self.table)

        # we are checking the last ball seen first, because if for example we saw the ball in frame 5 and frame 10 and the position did not change we dont need to judge again. so we just return false.

        clbs = self.check_last_ball_seen()
        if clbs[0]:
            Constants.WON_REASON = "Ball out of zone"
            self.game_status.next_state()
            self.game_stats.set_after_ball_out_zone(
                self.last_side_hitter, clbs[1])
            return self.track_score.update_score(clbs[1])

            # *  if its the same, return false as we dont need to change anything and we dont need to judge again.
        if (len(self.ball.positions) > 0 and self.ball.positions[-1] != self.last_judge_point):
            self.last_judge_point = self.ball.positions[-1]
        else:
            return (False,)

        self.ball.set_side_of_table()

        # update the who hit the ball last
        if self.ball.bounce_horizontal(self.last_side_hitter, self.table.quarters_intervals):
            self.game_stats.curr_mini_game_hits += 1
            self.last_side_hitter = (self.last_side_hitter + 1) % 2

        htp = self.hit_table_point()
        if htp[0]:
            Constants.WON_REASON = "Hit table point"
            self.game_status.next_state()
            self.game_stats.set_after_ball_out_zone(
                self.last_side_hitter, htp[1])
            return self.track_score.update_score(htp[1])

        db = self.double_bounce()
        if db[0]:
            Constants.WON_REASON = "Double bounce"
            self.game_status.next_state()
            self.game_stats.set_after_double_bounce(db[1])
            return self.track_score.update_score(db[1])

        if self.game_stats.curr_mini_game_hits == 1:
            boss = self.bounce_on_serve_side()
            if boss[0]:
                Constants.WON_REASON = "Bad Serve"
                self.game_status.next_state()
                self.game_stats.set_after_double_bounce(boss[1])
                return self.track_score.update_score(boss[1])
        return (False,)

    def bounce_on_serve_side(self):
        if len(self.ball.get_hit_positions()) == 1:
            # comparing the x values from the get hits positions
            print(f"_{self.ball.get_hit_positions()[0]}")
            in_left_side = self.table.left_table[0] <= self.ball.get_hit_positions()[
                0][0] <= self.table.left_table[2]

            in_right_side = self.table.right_table[0] <= self.ball.get_hit_positions()[
                0][0] <= self.table.right_table[2]
            if self.track_score.get_server() == Constants.LEFT_PLAYER and in_right_side:
                return True, Constants.RIGHT_PLAYER
            if self.track_score.get_server() == Constants.RIGHT_PLAYER and in_left_side:
                return True, Constants.LEFT_PLAYER
        return (False,)

    def test_right_hand(self, left_point, right_point):
        x_center = (left_point[0] + right_point[0]) / 2
        y_center = (left_point[1] + right_point[1]) / 2

        # Check if the right-hand condition is true
        hands_in_right_side = (
            self.table.right_zone[0] <= x_center <= self.table.right_zone[2]
        ) and (self.table.right_zone[1] <= y_center <= self.table.right_zone[3])
        return hands_in_right_side

    def test_left_hand(self, left_point, right_point):

        x_center = (left_point[0] + right_point[0]) / 2
        y_center = (left_point[1] + right_point[1]) / 2

        # Check if the left-hand condition is true
        hands_in_left_side = (
            self.table.left_zone[0] <= x_center <= self.table.left_zone[2]
        ) and (self.table.left_zone[1] <= y_center <= self.table.left_zone[3])
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
        # if there is more 2.5  seconds from the last we saw the ball and its a fault so we need to update the score.
        if (Constants.counterUntilFrame - self.last_frame_ball_seen_bounce > 2.5 * Constants.FPS):
            if len(self.ball.get_hit_positions()) == 0:
                return (False,)
            x_coordinate = self.ball.get_hit_positions()[-1][0]
            if (self.table.left_table[0] <= x_coordinate <= self.table.left_table[2]):
                return True, Constants.RIGHT_PLAYER
            # its in the right side so left is the winner
            return (True, Constants.LEFT_PLAYER)
        # nothing happened
        return (False,)
