import numpy as np
import cv2
import time

cap = cv2.VideoCapture(0)
# cap.set(3, 320)
# cap.set(4, 240)

NUM_FRAMES = 10
frame_times = []

first_frame = None

# warmup
for i in range(25):
    ret, frame = cap.read()

while True:
    fps = 0
    ret, frame = cap.read()

    # Our operations on the frame come here
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (31, 31), 0)
    gray = cv2.flip(gray, 1)

    if first_frame is None:
        first_frame = gray
        continue

    frame_delta = cv2.absdiff(first_frame, gray)
    thresh = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)[1]

    show = thresh

    # draw `show`

    if len(frame_times) > NUM_FRAMES:
        frames = frame_times[-NUM_FRAMES:]
        fps = (len(frames) - 1) / (frames[-1] - frames[0])

    cv2.putText(show, "FPS: {:.1f}".format(fps), (10, 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

    # Display the resulting frame
    cv2.imshow('frame', show)

    if cv2.waitKey(1) & 0xFF in (ord('q'), 27):
        break

    frame_times.append(time.time())

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
