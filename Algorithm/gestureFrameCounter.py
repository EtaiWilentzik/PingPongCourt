from Constants import Constants

# * decided whetter  the hand touches the table for 30 frames.


class gestureFrameCounter:
    def __init__(self):
        self.frame_count = 0
        self.right = [1] * Constants.ALLOWED_MISTAKES
        self.left = [1] * Constants.ALLOWED_MISTAKES

    def update(self, left, right):
        self.frame_count += 1
        if right and left:
            return (min(self.right) + Constants.FRAMES_TO_COUNT <= self.frame_count or
                    min(self.left) + Constants.FRAMES_TO_COUNT <= self.frame_count)
        elif right:
            self.left[self.left.index(min(self.left))] = self.frame_count
            return min(self.right) + Constants.FRAMES_TO_COUNT <= self.frame_count
        elif left:
            self.right[self.right.index(min(self.right))] = self.frame_count
            return min(self.left) + Constants.FRAMES_TO_COUNT <= self.frame_count

        self.right[self.right.index(min(self.right))] = self.frame_count
        self.left[self.left.index(min(self.left))] = self.frame_count
        return False
