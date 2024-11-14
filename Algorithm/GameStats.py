
class GameStats:
    def __init__(self, player_names):

        self.player_names = player_names
        self.longest_games_in_time = 0
        self.max_hits_in_game = 0
        self.average_hits_in_game = 0
        self.player_left = PlayerStats(player_names[0])
        self.player_right = PlayerStats(player_names[1])


class PlayerStats:
    def __init__(self, player_name):
        self.name = player_name
        # in place [0] is double bounce in your table,[1] is player miss i.e doing "out". [2] the ball jump in your side and the player din't  react to it .
        self.faults = [0]*3
        self.aces = 0
        self.average_speed = 0
        self.depth_of_hits = [0]*2
