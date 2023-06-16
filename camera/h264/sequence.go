package h264

import "io"

type Sequence struct {
	sps    []byte
	pps    []byte
	idr    []byte
	slices [][]byte
}

func (s *Sequence) Write(first bool, writer io.Writer) error {
	if first {
		if err := writeNALU(writer, s.sps); err != nil {
			return err
		}
		if err := writeNALU(writer, s.pps); err != nil {
			return err
		}
	}
	if err := writeNALU(writer, s.idr); err != nil {
		return err
	}
	for _, slice := range s.slices {
		if err := writeNALU(writer, slice); err != nil {
			return err
		}
	}
	//cFramesWritten.Add(1) //TODO: metrics
	return nil
}

func (s *Sequence) IsValid() error {
	return nil
}

func writeNALU(writer io.Writer, b []byte) error {
	if _, err := writer.Write([]byte{0, 0, 0, 1}); err != nil {
		return err
	}
	_, err := writer.Write(b)
	return err
}
