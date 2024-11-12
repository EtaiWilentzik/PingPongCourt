from Constants import Constants


class GameStatus:
    def __init__(self, wait_for_hand_function, wait_for_fault_function):
        self.state = Constants.wait_hand
        self.dic = {Constants.wait_hand: wait_for_hand_function,
                    Constants.wait_for_fault: wait_for_fault_function}

    def next_state(self):
        self.state = (self.state + 1) % 2

    def get_function(self):
        return self.dic[self.state]
