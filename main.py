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

do_dilate = True

while True:
    fps = 0
    ret, frame = cap.read()

    # Our operations on the frame come here
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # gray = frame
    gray = cv2.GaussianBlur(gray, (31, 31), 0)
    gray = cv2.flip(gray, 1)

    if first_frame is None:
        first_frame = gray
        continue

    frame_delta = cv2.absdiff(first_frame, gray)
    thresh = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)[1]

    if do_dilate:
        thresh = cv2.dilate(thresh, None, iterations=2)

    show = thresh

    # draw `show`
    if len(frame_times) > NUM_FRAMES:
        frames = frame_times[-NUM_FRAMES:]
        fps = (len(frames) - 1) / (frames[-1] - frames[0])

    text = "FPS: [{:.1f}] Dilate: [{}]".format(fps, int(do_dilate))
    cv2.putText(show, text, (11, 21),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)

    cv2.putText(show, text, (10, 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

    # Display the resulting frame
    cv2.imshow('frame', show)

    key = cv2.waitKey(1) & 0xFF
    if key in (ord('q'), 27):
        break

    if key == ord('d'):
        do_dilate = not do_dilate

    frame_times.append(time.time())

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
