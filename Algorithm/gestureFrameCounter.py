from sympy import false
from Constants import Constants

# * decided whetter  the hand touches the table for 30 frames.


class gestureFrameCounter:
    def __init__(self):
        self.frame_count = 0
        self.right = [1] * Constants.ALLOWED_MISTAKES
        self.left = [1] * Constants.ALLOWED_MISTAKES
        self.current = False

    def update(self, left, right):
        self.frame_count += 1
        if right and left:

            #!!!! left and right list "remember" where was the last time that we didn't see hand. for example if we didn't see (left and right) but we see only right we update left
            # if the last time
            self.current = (min(self.right) + Constants.FRAMES_TO_COUNT <= self.frame_count or
                            min(self.left) + Constants.FRAMES_TO_COUNT <= self.frame_count)
        elif right:
            # update the "oldest entry  in left to be the current frame  "
            self.left[self.left.index(min(self.left))] = self.frame_count
            self.current = min(self.right) + \
                Constants.FRAMES_TO_COUNT <= self.frame_count
            return
        elif left:
            self.right[self.right.index(min(self.right))] = self.frame_count
            self.current = min(self.left) + \
                Constants.FRAMES_TO_COUNT <= self.frame_count
            return

        self.right[self.right.index(min(self.right))] = self.frame_count
        self.left[self.left.index(min(self.left))] = self.frame_count
        self.current = False

    def get_current(self):
        return self.current
