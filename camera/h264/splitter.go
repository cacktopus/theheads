package h264

import (
	"bufio"
	"errors"
	"io"
)

var ErrMaxBufsize = errors.New("max buffer size exceeded")

const maxBufSize = 2 * 1024 * 1024

const (
	naluTypeSlice = 1
	naluTypeIDR   = 5
	naluTypeSPS   = 7
	naluTypePPS   = 8
)

// Split is a non-compliant h264 NALU parser. It will only parse certain files (e.g, those produced by raspivid)
// correctly
func Split(r io.Reader, callback func([]byte) error) error {
	var buf []byte

	r2 := bufio.NewReaderSize(r, 1024*64)

	for {
		read, err := r2.ReadBytes(byte(0))
		if err != nil {
			if err == io.EOF {
				return nil
			}
			return err
		}

		peek, err := r2.Peek(3)
		if err != nil {
			return err
		}

		if peek[0] == 0 && peek[1] == 0 && peek[2] == 1 {
			buf = append(buf, read[0:len(read)-1]...)
			_, err := r2.Discard(3)
			if err != nil {
				return err
			}
			if len(buf) > 0 {
				if err := callback(buf); err != nil {
					return err
				}
			} else if len(buf) > maxBufSize {
				return ErrMaxBufsize
			}
			buf = nil
		} else {
			buf = append(buf, read...)
		}
	}
}

func ParseStream(reader io.Reader, frames chan *Sequence) error {
	count := 0

	var sps []byte
	var pps []byte
	var seq *Sequence

	return Split(reader, func(nalu []byte) error {
		typ := nalu[0] & 0b11111

		switch typ {
		case naluTypeSPS:
			sps = nalu
		case naluTypePPS:
			pps = nalu
		case naluTypeIDR:
			if sps == nil || pps == nil {
				return errors.New("missing sps or pps")
			}
			if seq != nil {
				// TODO: handle eof (i.e., last in file)
				frames <- seq
			}
			seq = &Sequence{
				sps: sps,
				pps: pps,
				idr: nalu,
			}
		case naluTypeSlice:
			// TODO: handle eof (i.e., last in file)
			if seq == nil {
				return errors.New("missing seq")
			} else if seq.idr == nil {
				return errors.New("missing idr")
			}
			seq.slices = append(seq.slices, nalu)
		}

		count++
		return nil
	})
}
