import cv2
import numpy as np

import Constants
from video_handler import VideoWriter
from Constants import Color
from formulas import *


class MiniCourt:
    def __init__(self, frame):
        self.H, self.W, _ = frame.shape  # in our case H=1080 W=1920
        self.rectangle_width = 450
        self.rectangle_height = 200
        self.buffer = 100
        self.rectangle_thickness = 5
        self.padding_inside_rectangle = 50
        self.background_rectangle_padding = 250
        # give some space between the background to the legs.
        self.legs_padding_from_bottom = 30
        # for not coloring again the same pixel. i.e. when I draw the surface
        self.padding_from_overriding_color = 2
        # and after it the table it's not looking good without it
        self.set_coordinates()

    def set_coordinates(self):
        # set the background
        self.background_top_x = int(
            self.W / 2 - self.rectangle_width / 2)  # thats make the center of the rectangle to be in the center of the frame.
        # adding some padding to the y.
        self.background_top_y = int(self.H / 4) - \
            self.background_rectangle_padding
        self.background_bottom_x = int(
            self.background_top_x + self.rectangle_width)  # make it correlated to background top_x
        self.background_bottom_y = int(
            self.background_top_y + self.rectangle_height)  # make it correlated to backgroudn topp y
        # set the table coordinates
        # correspond to background top x.
        self.table_top_x = int(self.background_top_x + self.buffer)
        self.table_top_y = int(
            self.background_top_y + self.padding_inside_rectangle)  # padding inside the rectangle background
        self.table_bottom_x = int(
            self.background_bottom_x - self.buffer)  # make the smae size from both side of the table.
        # add the thickness of the table.
        self.table_bottom_y = int(self.table_top_y + self.rectangle_thickness)

        # use it as i want the left leg will be in 1/4 of
        distance = int((self.table_bottom_x - self.table_top_x) / 4)
        # the table width and the right in 3/4 width

        # this is the left leg
        self.left_leg_top_x = self.table_top_x + distance
        self.left_leg_top_y = int(
            self.table_bottom_y + self.padding_from_overriding_color)
        self.left_leg_bottom_x = self.left_leg_top_x + self.rectangle_thickness
        self.legs_bootom_y = self.background_bottom_y - self.legs_padding_from_bottom

        # this is the right leg.
        self.right_leg_top_x = self.table_top_x + 3 * distance
        self.right_leg_top_y = int(
            self.table_bottom_y + self.padding_from_overriding_color)
        self.right_leg_bottom_x = self.right_leg_top_x + self.rectangle_thickness

        # set the  net.
        self.net_top_x = int(self.table_top_x + 2 * distance - (
            self.rectangle_thickness / 2))  # divid by 2 because i want the net be in the middele and not the top left or the net
        self.net_top_y = int(self.background_top_y + (0.5 * (
            self.table_top_y - self.background_top_y)))  # its doing the net be 1/2 size of the padding from the top
        self.net_bottom_x = self.net_top_x + self.rectangle_thickness
        self.net_bottom_y = self.table_top_y - self.padding_from_overriding_color

    def draw_background_rectangle(self, frame):
        shapes = np.zeros_like(frame, np.uint8)
        # Draw the rectangle on the shapes image
        cv2.rectangle(shapes, (self.background_top_x, self.background_top_y),
                      (self.background_bottom_x, self.background_bottom_y), Color.WHITE, cv2.FILLED)

        # Create a mask
        mask = shapes.astype(bool)

        # Apply alpha blending to the frame with the shapes image using the mask
        alpha = 0.5
        frame[mask] = cv2.addWeighted(frame, alpha, shapes, 1 - alpha, 0)[mask]

    def draw_mini_court_table(self, frame):
        # draw the net
        cv2.rectangle(frame, (self.net_top_x, self.net_top_y), (self.net_bottom_x, self.net_bottom_y), Color.WHITE,
                      cv2.FILLED)
        # draw the right leg of the table.
        cv2.rectangle(frame, (self.right_leg_top_x, self.right_leg_top_y),
                      (self.right_leg_bottom_x, self.legs_bootom_y),
                      Color.GOLD, cv2.FILLED)
        # draw the left leg of the table
        cv2.rectangle(frame, (self.left_leg_top_x, self.left_leg_top_y), (self.left_leg_bottom_x, self.legs_bootom_y),
                      Color.GOLD, cv2.FILLED)
        #  draw the surface of the table
        cv2.rectangle(frame, (self.table_top_x, self.table_top_y), (self.table_bottom_x, self.table_bottom_y),
                      Color.BLUE, cv2.FILLED)

    def draw_mini_court(self, frame, game):
        self.draw_background_rectangle(frame)
        self.draw_mini_court_table(frame)
        self.draw_ball(game, frame)

    def draw_ball(self, game, frame):
        table_length = game.table.get_bottom_right()[0] - game.table.get_top_left()[
            0]  # length of table in pixels (right - left)
        table_height = game.table.get_top_left()[1] - game.table.get_bottom_right()[
            1]  # height of table in pixels (top - bottom)
        table_size = math.sqrt(
            table_length ** 2 + table_height ** 2)  # Pythagoras formula - to get the real length of table (without
        # the slope)
        Constants.TABLE_SIZE = table_size
        tmp_positions = game.ball.get_hit_positions()  # get last 2 hits of ball on table

        for position in tmp_positions:
            distance_ball = calculate_linear_distance(
                position, game.table.get_top_left())  # distance in pixels
            x_mini_court = int(
                self.table_top_x + (distance_ball / table_size) * (self.table_bottom_x - self.table_top_x))  #
            # calculate the x coordinate
            # of ball in new table according to relative position in real table

            cv2.circle(frame, (x_mini_court,
                       self.table_top_y - 5), 5, Color.RED, cv2.FILLED)  # draw the
            # ball
