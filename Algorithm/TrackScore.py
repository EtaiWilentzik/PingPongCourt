from Constants import Constants


class TrackScore:
    def __init__(self, starter):
        self.right_player = 0
        self.left_player = 0
        self.server = starter
        self.serve_count = 0

    def get_server(self):
        return self.server

    def update_score(self, player):
        if player == Constants.RIGHT_PLAYER:
            self.right_player += 1
        else:
            self.left_player += 1

        self.serve_count += 1
        if self.serve_count == 2:
            self.serve_count = 0
            self.server = Constants.LEFT_PLAYER if self.server == Constants.RIGHT_PLAYER else Constants.RIGHT_PLAYER

        return self.get_status()

    def get_status(self):
        if self.right_player >= 11 and self.right_player >= self.left_player + 2:
            return True, Constants.RIGHT_PLAYER
        elif self.left_player >= 11 and self.left_player >= self.right_player + 2:
            return True, Constants.LEFT_PLAYER
        else:
            return False,

    def get_score(self):
        return f" {self.left_player} -  {self.right_player}"
