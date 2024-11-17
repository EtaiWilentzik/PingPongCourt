from Constants import Constants


class Table:
    def __init__(self):
        self.list = [0.0, 0.0, 0.0, 0.0]
        self.left_table = [0.0, 0.0, 0.0, 0.0]
        self.right_table = [0.0, 0.0, 0.0, 0.0]
        self.counter = 0
        self.counter_net = 0
        self.top_left = (0, 0)
        self.bottom_right = (0, 0)
        self.bottom_net = (0, 0)
        self.top_net = (0, 0)
        self.netlist = [0.0, 0.0, 0.0, 0.0]
        self.left_zone = [0.0, 0.0, 0.0, 0.0]
        self.right_zone = [0.0, 0.0, 0.0, 0.0]
        self.quarters_intervals = []

    def get_top_left(self):
        return self.top_left

    def set_top_left(self, top_left):
        self.top_left = top_left

    def get_bottom_right(self):
        return self.bottom_right

    def set_bottom_right(self, bottom_right):
        self.bottom_right = bottom_right

    def get_bottom_net(self):
        return self.bottom_net

    def set_bottom_net(self, bottom_net):
        self.bottom_net = bottom_net

    def get_top_net(self):
        return self.top_net

    def set_top_net(self, top_net):
        self.top_net = top_net

    # for 2 seconds we determine the table dimensions
    def sum_table(self, top_left, bottom_right):
        self.list[0] += top_left[0]
        self.list[1] += top_left[1]
        self.list[2] += bottom_right[0]
        self.list[3] += bottom_right[1]
        self.counter += 1

    def set_coordinates_table(self):
        for i in range(len(self.list)):
            # int divide is //
            self.list[i] = int(self.list[i] / self.counter)
        self.set_top_left((self.list[0], self.list[1]))
        self.set_bottom_right((self.list[2], self.list[3]))

    def set_touch_zones(self):
        # adding margin  to both sides
        x_align_increment = (self.left_table[2]-self.left_table[0])/6
        small_epsilon = 20
        # left touch zones
        self.left_zone[0] = self.get_top_left()[0]
        self.left_zone[1] = self.get_top_left()[1]
        self.left_zone[2] = self.get_top_left()[0]+x_align_increment
        self.left_zone[3] = self.get_bottom_net()[1]+small_epsilon

        # right touch zones
        self.right_zone[0] = self.get_bottom_right()[0]-x_align_increment
        self.right_zone[1] = self.get_top_left()[1]
        self.right_zone[2] = self.get_bottom_right()[0]
        self.right_zone[3] = self.get_bottom_net()[1]+small_epsilon

    def set_coordinates_net(self):
        for i in range(len(self.netlist)):
            self.netlist[i] //= self.counter_net
        self.set_top_net((self.netlist[0], self.netlist[1]))
        self.set_bottom_net((self.netlist[2], self.netlist[3]))
        # add constant of x coordinate of net
        Constants.NET_X = self.netlist[0]
        print(f"net is { Constants.NET_X }")

    def set_two_sides(self):
        # declare the left side of the table
        self.left_table[0] = self.get_top_left()[0]
        self.left_table[1] = self.get_top_left()[1]
        self.left_table[2] = self.get_top_net()[0]
        self.left_table[3] = self.get_bottom_net()[1]
        # moving to declare the right side of the table.
        self.right_table[0] = self.get_bottom_net()[0]
        self.right_table[1] = self.get_top_left()[1]
        self.right_table[2] = self.get_bottom_right()[0]
        self.right_table[3] = self.get_bottom_net()[1]

    def sum_net(self, top_net, bottom_net):
        self.netlist[0] += top_net[0]
        self.netlist[1] += top_net[1]
        self.netlist[2] += bottom_net[0]
        self.netlist[3] += bottom_net[1]
        self.counter_net += 1
        # if self.counter_net == 2 * Constants.FPS:

    # def set_table_dimensions(self):
    #     self.set_coordinates_table()
    #     self.set_coordinates_net()
    #     self.set_two_sides()
    def set_intervals(self, segments=8):
        left_x = self.get_top_left()[0]
        right_x = self.get_bottom_right()[0]
        step = (right_x - left_x) / segments
        self.quarters_intervals = [
            (left_x + i * step, left_x + (i + 1) * step) for i in range(segments)]
        # print("set_intervals", self.quarters_intervals)
