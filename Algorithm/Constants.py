

class Constants:
    counterUntilFrame = 0  # count up until table is fixed
    SERVE_LEFT = 0
    HIT_LEFT_TABLE_AFTER_SERVE = 1
    SERVE_RIGHT = 2
    HIT_RIGHT_TABLE_AFTER_SERVE = 3
    NET_FROM_LEFT = 4
    NET_FROM_RIGHT = 5
    HIT_RIGHT_TABLE = 6
    HIT_LEFT_TABLE = 7
    BLOCKED_FROM_RIGHT = 8
    BLOCKED_FROM_LEFT = 9
    OUT_FROM_LEFT = 10
    OUT_FROM_RIGHT = 11
    LEFT = 0
    RIGHT = 1
    X_COORDINATE = 0
    Y_COORDINATE = 1
    EPSILON = 40
    LAST = -1
    IS_BOUNCE_VERTICAL = 2
    IS_BOUNCE_HORIZONTAL = 3
    FPS = 30

    Ball_ID = 0
    Ball_ID_NEW_TRAIN = 0
    Hand_ID_NEW_TRAIN = 1
    NET_ID = 1
    TABLE_ID = 2
    Hand_ID = 3

    L_RESULT = 5
    R_RESULT = 0
    THRESHOLD = 0.15  # threshold of accuracy of classification
    TABLE_SIZE = 1
    LEFT_PLAYER = 0
    RIGHT_PLAYER = 1
    NET_X = 0

    ALLOWED_MISTAKES = 6
    FRAMES_TO_COUNT = 15

    wait_hand = 0
    wait_for_fault = 1
    WON_REASON = "NONE"


class Dimensions:
    TABLE_WIDTH = 152.5
    TABLE_HEIGHT = 76
    TABLE_HALF_LENGTH = 137  # ALL TABLE LENGTH IS 137*2


# colors defined in BGR format: this is how open cv work with colors
class Color:
    BLACK = (0, 0, 0)
    RED = (0, 0, 255)
    GREEN = (0, 255, 0)
    BLUE = (255, 0, 0)
    PURPLE = (128, 0, 128)
    MAGENTA = (255, 0, 255)
    YELLOW = (0, 255, 255)
    WHITE = (255, 255, 255)
    PINK = (203, 192, 255)  # Adjusted to a lighter shade of pink
    AQUA = (255, 255, 0)
    ORANGE = (0, 165, 255)
    BROWN = (42, 42, 165)
    MAROON = (0, 0, 128)
    TEAL = (128, 128, 0)
    NAVY = (128, 0, 0)
    OLIVE = (0, 128, 128)
    LIME = (0, 255, 0)
    CYAN = (255, 255, 0)
    SILVER = (192, 192, 192)
    GRAY = (128, 128, 128)
    DARK_GRAY = (64, 64, 64)
    LIGHT_GRAY = (192, 192, 192)
    GOLD = (0, 215, 255)
    SALMON = (114, 128, 250)
    TURQUOISE = (208, 224, 64)
    INDIGO = (130, 0, 75)
    STEEL_BLUE = (180, 130, 70)
    TAN = (140, 180, 210)
    VIOLET = (238, 130, 238)
