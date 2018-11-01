import time

import cv2
import requests

cap = cv2.VideoCapture(0)
# cap.set(3, 320)
# cap.set(4, 240)

MIN_AREA = 500 * 4
NUM_FRAMES = 10
frame_times = []

SCALE = 25

avg = None

# warmup
for i in range(5):
    ret, frame = cap.read()

do_dilate = True

while True:
    fps = 0
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)
    height, width, channels = frame.shape

    # Our operations on the frame come here
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # gray = frame
    gray = cv2.GaussianBlur(gray, (21, 21), 0)

    if avg is None:
        avg = gray.copy().astype("float32")
        continue

    cv2.accumulateWeighted(gray, avg, 0.4)

    frame_delta = cv2.absdiff(gray, cv2.convertScaleAbs(avg))
    thresh = cv2.threshold(frame_delta, 20, 255, cv2.THRESH_BINARY)[1]

    if do_dilate:
        thresh = cv2.dilate(thresh, None, iterations=2)

    _, countours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
                                       cv2.CHAIN_APPROX_SIMPLE)

    countours = [c for c in countours if cv2.contourArea(c) > MIN_AREA]

    if countours:
        _, track = max((cv2.contourArea(c), c) for c in countours)
    else:
        track = None

    ############################ draw `show` ##############################
    # show = avg.astype("uint8")
    show = frame

    if track is not None:
        (x, y, w, h) = cv2.boundingRect(track)
        cv2.rectangle(show, (x, y), (x + w, y + h), (128, 128, 128), 2)

        pos = x + w // 2
        cv2.line(show, (pos, y), (pos, y + h), (128, 128, 128), 2)

        half = width / 2
        pos2 = int(SCALE * ((pos - half) / half))
        requests.get(
            url="http://rpi3-04:8080/position/{}?speed=1000".format(pos2)
        )

    else:
        pos = None
        pos2 = None

    if len(frame_times) > NUM_FRAMES:
        frames = frame_times[-NUM_FRAMES:]
        fps = (len(frames) - 1) / (frames[-1] - frames[0])


    text = "FPS: [{:.1f}] Dilate: [{}] Contours: [{}], Pos: [{}], Pos2: [{}], Width: [{}]".format(
        fps,
        int(do_dilate),
        len(countours),
        pos,
        pos2,
        width,
    )

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
