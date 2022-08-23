package voices

import (
	"context"
	"fmt"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/util"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"math/rand"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync/atomic"
)

type Cfg struct {
	MediaPath string `envconfig:"optional"`

	Card          string `envconfig:"default=Device"`
	VolumeControl string `envconfig:"default=Speaker"`
}

type Server struct {
	listener net.Listener
	cfg      *Cfg
	logger   *zap.Logger

	playing int32
}

func (s *Server) SetVolume(ctx context.Context, in *gen.SetVolumeIn) (*gen.Empty, error) {
	if in.VolDb >= 0 {
		return nil, errors.New("volume (decibels) must be negative")
	}

	args := []string{
		"amixer",
		"-D", fmt.Sprintf("hw:CARD=%s", s.cfg.Card),
		"sset", s.cfg.VolumeControl,
		"--", fmt.Sprintf("%ddb", in.VolDb),
	}

	s.logger.Info("running amixer", zap.String("command_line", strings.Join(args, " ")))

	cmd := exec.Command(args[0], args[1:]...)

	output, err := cmd.CombinedOutput()
	if err != nil {
		s.logger.Error("error setting volume", zap.Error(err), zap.String("output", string(output)))
		return nil, errors.Wrap(err, "setting volume")
	}

	return &gen.Empty{}, nil
}

func (s *Server) Play(ctx context.Context, in *gen.PlayIn) (*gen.Empty, error) {
	// TODO: prevent ../path style attacks
	filename := filepath.Join(
		s.cfg.MediaPath,
		in.Sound,
	)

	logger := s.logger.With(zap.String("filename", filename))

	if !util.Exists(filename) {
		logger.Error("media not found")
		return nil, status.Error(codes.NotFound, "media not found")
	}

	err := s.play(filename)
	if err == AlreadyPlayingErr {
		logger.Warn("already playing", zap.Error(err))
		return nil, status.Error(codes.Unavailable, "already playing")
	} else if err != nil {
		logger.Error("error playing", zap.Error(err))
		return nil, status.Error(codes.Internal, "already playing")
	}

	return &gen.Empty{}, nil
}

func (s *Server) Random(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	var files []string
	err := filepath.Walk(s.cfg.MediaPath, func(path string, info os.FileInfo, err error) error {
		if strings.HasSuffix(path, ".wav") {
			files = append(files, path)
		}
		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err, "walk")
	}

	if len(files) == 0 {
		return nil, errors.New("no media found")
	}

	n := rand.Intn(len(files))
	choice := files[n]

	err = s.play(choice)
	if err != nil {
		return nil, err
	}

	return &gen.Empty{}, nil
}

func NewServer(cfg *Cfg, logger *zap.Logger) *Server {
	return &Server{
		cfg:    cfg,
		logger: logger,
	}
}

func (s *Server) Setup() error {
	var err error

	s.listener, err = net.Listen("tcp", "0.0.0.0:3031")
	if err != nil {
		return errors.Wrap(err, "listen")
	}
	return nil
}

var AlreadyPlayingErr = errors.New("already playing")

func (s *Server) play(filename string) error {
	logger := s.logger.With(zap.String("filename", filename))

	swapped := atomic.CompareAndSwapInt32(&s.playing, 0, 1)
	defer atomic.StoreInt32(&s.playing, 0)

	args := append(execPlay(s.cfg.Card), filename)

	logger.Debug("play",
		zap.Bool("swapped", swapped),
		zap.String("command_line", strings.Join(args, " ")),
	)

	if !swapped {
		return AlreadyPlayingErr
	}

	cmd := exec.Command(args[0], args[1:]...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		logger.Error("error playing",
			zap.Error(err),
			zap.String("output", string(output)),
			zap.String("filename", filename),
		)
		return errors.Wrap(err, "playing")
	}

	return nil
}
