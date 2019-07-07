#include <math.h>

void trace(
    float *grid,
    int width, int height,
    float pos_x, float pos_y,
    float dx, float dy,
    int steps,
    float value_increase
) {
    for (int i=0; i<steps; i++) {
        // I know there is a faster line drawing algorithm out there, but ...

        int yidx = floorf(pos_x); // notice swap here
        int xidx = floorf(pos_y); // notice swap here

        *(grid + width * xidx + yidx) += value_increase;

        pos_x += dx;
        pos_y += dy;
    }
}