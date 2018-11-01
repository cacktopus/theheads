import numpy as np
import cv2
import time

cap = cv2.VideoCapture(0)
# cap.set(3, 320)
# cap.set(4, 240)

NUM_FRAMES = 10
frame_times = []

while True:
    fps = 0
    ret, frame = cap.read()

    # Our operations on the frame come here
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # gray = cv2.GaussianBlur(gray, (27, 27), 0)
    gray = cv2.flip(gray, 1)

    if len(frame_times) > NUM_FRAMES:
        frames = frame_times[-NUM_FRAMES:]
        fps = (len(frames) - 1) / (frames[-1] - frames[0])

    cv2.putText(gray, "FPS: {:.1f}".format(fps), (10, 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

    # Display the resulting frame
    cv2.imshow('frame', gray)

    if cv2.waitKey(1) & 0xFF in (ord('q'), 27):
        break

    frame_times.append(time.time())

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
