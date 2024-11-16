from Constants import *


class GameStats:
    def __init__(self, player_names):

        self.player_names = player_names
        self.longest_games_in_time = 0
        self.max_hits_in_game = 0
        self.max_hits_all_game = 0
        self.curr_mini_game_hits = 0
        self.sum_all_hits=0
        self.average_hits_in_game = 0
        self.player_left = PlayerStats(player_names[0])
        self.player_right = PlayerStats(player_names[1])

    def set_after_point(self):
        self.player_right.player_name = "daniel"
        print("25")

    def set_after_ball_out_zone(self, last_hitter, zone):
        print("setting after ball out zone")
        if zone == Constants.LEFT_PLAYER:
            if last_hitter == Constants.LEFT_PLAYER:
                self.player_left.win_reasons[2] += 1
                print("right could not respond to left hit")
            if last_hitter == Constants.RIGHT_PLAYER:
                self.player_left.win_reasons[1] += 1
                print("right player did out")
        if zone == Constants.RIGHT_PLAYER:
            if last_hitter == Constants.LEFT_PLAYER:
                self.player_right.win_reasons[1] += 1
                print("left player did out")
            if last_hitter == Constants.RIGHT_PLAYER:
                self.player_right.win_reasons[2] += 1
                print("left could not respone to right hit")
        self.set_after_point()

    def set_after_double_bounce(self, zone):
        if zone == Constants.LEFT_PLAYER:
            self.player_left.win_reasons[0] += 1
        if zone == Constants.RIGHT_PLAYER:
            self.player_right.win_reasons[0] += 1
        self.set_after_point()
        print("setting after double_bounce")

    def set_areas_of_hits(self):
        print("1")

    def end_of_game_statistics(self):
        self.print_all_statistics()

    def print_all_statistics(self):
        print("the left player stats")
        print(self.player_left.win_reasons)
        print("the right player stats")
        print(self.player_right.win_reasons)


class PlayerStats:
    def __init__(self, player_name):
        self.name = player_name
        # in place [0] is double bounce on opponents table,[1] is opponent miss i.e doing "out". [2] you hit opponent side and he  can not respod
        self.win_reasons = [0] * 3
        # self.aces = 0
        self.average_speed = 0
        self.depth_of_hits = [0] * 4
