from Constants import *
import requests
import csv
import os


class GameStats:

    def __init__(self, player_names):

        self.player_names = player_names
        self.longest_games_in_time = 0
        self.max_hits_in_game = 0
        # number of hits inside one point.
        self.curr_mini_game_hits = 1
        self.sum_all_hits = 0
        self.average_hits_in_game = 0
        # index 0 means 1 hit, index 1 means 2-3 hits, index 2 means 4-7 hits, index 3 meanse 8+ hits
        self.hits_in_game = [0] * 4
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

    def save_to_csv(self, data_dict, filename="output.csv"):
        # Open a CSV file for writing
        csv_dir = os.path.join('.', 'csv_reports')
        os.makedirs(csv_dir, exist_ok=True)  # Ensure the directory exists
        # Construct the full path for the CSV file
        filepath = os.path.join(csv_dir, filename)
        with open(filepath, mode='w', newline='') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=data_dict.keys())

            # Write the header
            writer.writeheader()

            # Write the data
            writer.writerow(data_dict)

    def to_dict(self):
        return {
            "max_hits_in_game": self.max_hits_in_game,
            "average_hits_in_game": self.average_hits_in_game,
            "hits_in_game_stats": self.hits_in_game,
            "player_left": self.player_left.to_dict(),
            "player_right": self.player_right.to_dict()}

    def set_after_point(self, winner):
        if self.curr_mini_game_hits == 1:
            if winner == Constants.LEFT_PLAYER:
                self.player_left.aces += 1
            else:
                self.player_right.aces += 1
            self.hits_in_game[0] += 1
        elif 2 <= self.curr_mini_game_hits <= 3:
            self.hits_in_game[1] += 1
        elif 4 <= self.curr_mini_game_hits <= 7:
            self.hits_in_game[2] += 1
        elif self.curr_mini_game_hits >= 8:
            self.hits_in_game[3] += 1
        print("number of paddle hits after this mini-game",
              self.curr_mini_game_hits)
        self.sum_all_hits += self.curr_mini_game_hits
        if self.curr_mini_game_hits > self.max_hits_in_game:
            self.max_hits_in_game = self.curr_mini_game_hits
        self.curr_mini_game_hits = 1

    def set_after_ball_out_zone(self, last_hitter, winner):
        print("setting after ball out zone")
        if winner == Constants.RIGHT_PLAYER:
            if last_hitter == Constants.LEFT_PLAYER:
                self.player_left.loss_reasons[2] += 1
                print("right could not respond to left hit")
            if last_hitter == Constants.RIGHT_PLAYER:
                self.player_left.loss_reasons[1] += 1
                print("right player did out")
        if winner == Constants.LEFT_PLAYER:
            if last_hitter == Constants.LEFT_PLAYER:
                self.player_right.loss_reasons[1] += 1
                print("left player did out")
            if last_hitter == Constants.RIGHT_PLAYER:
                self.player_right.loss_reasons[2] += 1
                print("left could not respond to right hit")
        self.set_after_point(winner)

    def set_after_double_bounce(self, winner):
        print("setting after double_bounce")
        if winner == Constants.LEFT_PLAYER:
            self.player_right.loss_reasons[0] += 1
        if winner == Constants.RIGHT_PLAYER:
            self.player_left.loss_reasons[0] += 1
        self.set_after_point(winner)

    def set_after_bad_serve(self, winner):
        if winner == Constants.RIGHT_PLAYER:
            self.player_left.loss_reasons[3] += 1
        if winner == Constants.LEFT_PLAYER:
            self.player_right.loss_reasons[3] += 1

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

    def end_of_game_statistics(self, track_score, ball, video_name):
        sum_points = track_score.right_player + track_score.left_player
        if self.sum_all_hits != 0:
            self.average_hits_in_game = self.sum_all_hits / sum_points
        self.player_left.fastest_ball_speed = ball.fastest_left_speed
        self.player_left.fastest_ball_frame = ball.fastest_left_frame
        self.player_right.fastest_ball_speed = ball.fastest_right_speed
        self.player_right.fastest_ball_frame = ball.fastest_right_frame
        self.player_left.points = track_score.left_player
        self.player_right.points = track_score.right_player
        self.print_all_statistics()
        print(self.to_dict())
        self.save_to_csv(self.to_dict(), video_name)
        # self.send_to_server()

    def print_all_statistics(self):
        print("the left player loss_point_reason")
        print(self.player_left.loss_reasons)
        print("the right player loss_point_resaons")
        print(self.player_right.loss_reasons)
        print("the left player depth_hit")
        print(self.player_left.depth_of_hits)
        print("the right player depth_hit")
        print(self.player_right.depth_of_hits)
        print("the average paddle hits per points are",
              self.average_hits_in_game)
        print("the most paddle hits for points are", self.max_hits_in_game)
        print(
            f"left pleyer fastest spped is {self.player_left.fastest_ball_speed} in frame {self.player_left.fastest_ball_frame}")
        print(
            f"right pleyer fastest spped is {self.player_right.fastest_ball_speed} in frame {self.player_right.fastest_ball_frame}")


class PlayerStats:
    def __init__(self, player_name):
        self.name = player_name
        self.points = 0
        self.fastest_ball_speed = 0.0
        self.fastest_ball_frame = 0
        # in place [0] is double bounce on your table,[1] is miss i.e doing "out". [2] opopnent hits yours dide and oy ucan not rspond [3] is bad serve
        self.loss_reasons = [0] * 4
        self.aces = 0
        self.bad_serves = 0
        self.average_speed = 0
        self.depth_of_hits = [0]*8
    #! i didnt enterd the bad serve to the sserver.

    def to_dict(self):
        return {
            "name": self.name,
            "points": self.points,
            "faults": self.loss_reasons,
            "aces": self.aces,
            "fastest_ball_speed": self.fastest_ball_speed,
            "bad_serves": self.bad_serves,
            "depth_of_hits": self.depth_of_hits}
