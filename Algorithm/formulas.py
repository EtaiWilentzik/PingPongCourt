import math


def calculate_linear_distance(point1, point2):
    x1, y1 = point1
    x2, y2 = point2
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


def convert_pixel_distance_to_meters(self, pixel_distance, refrence_height_in_meters, refrence_height_in_pixels):
    return (pixel_distance * refrence_height_in_meters) / refrence_height_in_pixels


def convert_meters_to_pixel_distance(self, meters, refrence_height_in_meters, refrence_height_in_pixels):
    return (meters * refrence_height_in_pixels) / refrence_height_in_meters
