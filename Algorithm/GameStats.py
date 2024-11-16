
import requests

url = "http://localhost:3000/games/stats"


class GameStats:
    def __init__(self, player_names):
        self.longest_games_in_time = 0
        self.max_hits_in_game = 0
        self.average_hits_in_game = 0
        self.player_left = PlayerStats(player_names[0])
        self.player_right = PlayerStats(player_names[1])

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
        response = requests.post(url, json=data)

        # Check the response
        if response.status_code == 200:
            print("Data sent successfully:", response.json())
        else:
            print(
                f"Failed to send data: {response.status_code}, {response.text}")


class PlayerStats:
    def __init__(self, player_name):
        self.name = player_name
        self.faults = [0] * 3
        self.aces = 0
        self.average_speed = 0
        self.depth_of_hits = [0] * 2

    def to_dict(self):
        return {
            "name": self.name,
            "faults": self.faults,
            "aces": self.aces,
            "average_speed": self.average_speed,
            "depth_of_hits": self.depth_of_hits
        }
