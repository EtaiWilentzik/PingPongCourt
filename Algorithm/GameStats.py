from Constants import *
import requests


class GameStats:

    def __init__(self, player_names):

        self.player_names = player_names
        self.longest_games_in_time = 0
        self.max_hits_in_game = 0
        # number of hits inside one point.
        self.curr_mini_game_hits = 1
        self.sum_all_hits = 0
        self.average_hits_in_game = 0
        self.player_left = PlayerStats(player_names[0])
        self.player_right = PlayerStats(player_names[1])
        self.url = "http://localhost:3000/games/stats"

    def send_to_server(self):
        data = self.to_dict()
        print("the data is "+data)
        response = requests.post(self.url, json=data)
        # Check the response
        if response.status_code == 200:
            print("Data sent successfully:", response.json())
        else:
            print(
                f"Failed to send data: {response.status_code}, {response.text}")

    def to_dict(self):
        return {
            "max_hits_in_game": self.max_hits_in_game,
            "average_hits_in_game": self.average_hits_in_game,
            "player_left": self.player_left.to_dict(),
            "player_right": self.player_right.to_dict()}

    def set_after_point(self, winner):
        if self.curr_mini_game_hits == 1:
            if winner == Constants.LEFT_PLAYER:
                self.player_left.aces += 1
            else:
                self.player_right.aces += 1
        print("number of paddle hits after this mini-game",
              self.curr_mini_game_hits)
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
                print("left could not respond to right hit")
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
        print(zone_num)
        print(last_hit_x)
        print(ranges)

        if last_hitter == Constants.LEFT_PLAYER:
            self.player_left.depth_of_hits[zone_num] += 1
        if last_hitter == Constants.RIGHT_PLAYER:
            zone_num = 7 - zone_num
            self.player_right.depth_of_hits[zone_num] += 1

    def end_of_game_statistics(self, track_score):
        sum_points = track_score.right_player + track_score.left_player
        if self.sum_all_hits != 0:
            self.average_hits_in_game = self.sum_all_hits / sum_points
        self.player_left.points = track_score.left_player
        self.player_right.points = track_score.right_player
        self.print_all_statistics()
        self.send_to_server()

    def print_all_statistics(self):
        print("the left player win_point_reason")
        print(self.player_left.win_reasons)
        print("the right player ein_point_resaons")
        print(self.player_right.win_reasons)
        print("the left player depth_hit")
        print(self.player_left.depth_of_hits)
        print("the right player depth_hit")
        print(self.player_right.depth_of_hits)
        print("the average paddle hits per points are",
              self.average_hits_in_game)
        print("the most paddle hits for points are", self.max_hits_in_game)

    def to_dict(self):
        return {
            "longest_games_in_time": self.longest_games_in_time,
            "max_hits_in_game": self.max_hits_in_game,
            "average_hits_in_game": self.average_hits_in_game,
            "player_left": self.player_left.to_dict(),
            "player_right": self.player_right.to_dict()
        }

    def send_to_server(self):
        data = self.to_dict()
        response = requests.post(self.url, json=data)

        # Check the response
        if response.status_code == 200:
            print("Data sent successfully:", response.json())
        else:
            print(
                f"Failed to send data: {response.status_code}, {response.text}")


class PlayerStats:
    def __init__(self, player_name):
        self.name = player_name
        # in place [0] is double bounce in your table,[1] is player miss i.e doing "out". [2] the ball jump in your side and the player din't  react to it .
        self.win_reasons = [0]*3
        self.aces = 0
        self.bad_serves = 0
        self.average_speed = 0
        self.depth_of_hits = [0]*8
    #! i didnt enterd the bad serve to the sserver.

    def to_dict(self):
        return {
            "name": self.name,
            "faults": self.win_reasons,
            "aces": self.aces,
            "average_speed": self.average_speed,
            "depth_of_hits": self.depth_of_hits
        }
