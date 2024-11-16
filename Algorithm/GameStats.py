from Constants import *


class GameStats:
    def __init__(self, player_names):

        self.player_names = player_names
        self.longest_games_in_time = 0
        self.max_hits_in_game = 0
        self.curr_mini_game_hits = 1
        self.sum_all_hits = 0
        self.average_hits_in_game = 0
        self.player_left = PlayerStats(player_names[0])
        self.player_right = PlayerStats(player_names[1])

    def set_after_point(self, winner):
        if self.curr_mini_game_hits == 1:
            if winner == Constants.LEFT_PLAYER:
                self.player_left.aces += 1
            else:
                self.player_right.aces += 1
        print("number of paddle hits after this mini-game", self.curr_mini_game_hits)
        self.sum_all_hits += self.curr_mini_game_hits
        if self.curr_mini_game_hits > self.max_hits_in_game:
            self.max_hits_in_game = self.curr_mini_game_hits
        self.curr_mini_game_hits = 1

    def set_after_ball_out_zone(self, last_hitter, winner):
        print("setting after ball out zone")
        if winner == Constants.LEFT_PLAYER:
            if last_hitter == Constants.LEFT_PLAYER:
                self.player_left.win_reasons[2] += 1
                print("right could not respond to left hit")
            if last_hitter == Constants.RIGHT_PLAYER:
                self.player_left.win_reasons[1] += 1
                print("right player did out")
        if winner == Constants.RIGHT_PLAYER:
            if last_hitter == Constants.LEFT_PLAYER:
                self.player_right.win_reasons[1] += 1
                print("left player did out")
            if last_hitter == Constants.RIGHT_PLAYER:
                self.player_right.win_reasons[2] += 1
                print("left could not respone to right hit")
        self.set_after_point(winner)

    def set_after_double_bounce(self, winner):
        print("setting after double_bounce")
        if winner == Constants.LEFT_PLAYER:
            self.player_left.win_reasons[0] += 1
        if winner == Constants.RIGHT_PLAYER:
            self.player_right.win_reasons[0] += 1
        self.set_after_point(winner)

    def set_areas_of_hits(self, last_hitter, last_hit_x, ranges):
        zone_num = 0
        for i, (start, end) in enumerate(ranges):
            if start <= last_hit_x <= end:
                zone_num = i
        if last_hitter == Constants.LEFT_PLAYER:
            self.player_left.depth_of_hits[zone_num] += 1
        if last_hitter == Constants.RIGHT_PLAYER:
            zone_num = 7 - zone_num
            self.player_right.depth_of_hits[zone_num] += 1

    def end_of_game_statistics(self, track_score):
        sum_points = track_score.right_player + track_score.left_player
        if self.sum_all_hits != 0:
            self.average_hits_in_game = self.sum_all_hits / sum_points
        self.print_all_statistics()

    def print_all_statistics(self):
        print("the left player win_point_reson")
        print(self.player_left.win_reasons)
        print("the right player ein_point_resons")
        print(self.player_right.win_reasons)
        print("the left player depth_hit")
        print(self.player_left.depth_of_hits)
        print("the right player depth_hit")
        print(self.player_right.depth_of_hits)
        print("the average paddle hits per points are", self.average_hits_in_game)
        print("the most paddle hits for points are", self.max_hits_in_game)


class PlayerStats:
    def __init__(self, player_name):
        self.name = player_name
        # in place [0] is double bounce on opponents table,[1] is opponent miss i.e doing "out". [2] you hit opponent side and he  can not respod
        self.win_reasons = [0] * 3
        self.aces = 0
        self.bad_serves = 0
        self.average_speed = 0
        self.depth_of_hits = [0] * 8
