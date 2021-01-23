package http

import (
	"github.com/cacktopus/theheads/common/schema"
	"github.com/cacktopus/theheads/head/log_limiter"
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/motor/zero_detector"
	"github.com/cacktopus/theheads/head/sensor"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"net/http"
	"strconv"
	"time"
)

func Routes(
	router *gin.Engine,
	logger *zap.Logger,
	controller *motor.Controller,
	seeker motor.Actor,
	sensor sensor.Sensor,
	motorCfg *motor.Cfg,
) {
	ll := log_limiter.NewLimiter(250 * time.Millisecond)

	router.GET("/rotation/:rotation", func(c *gin.Context) {
		ll.Do(func() {
			logger.Info("GET", zap.String("path", c.FullPath()))
		})

		c.Status(http.StatusOK)
		s := c.Param("rotation")
		rotation, err := strconv.ParseFloat(s, 64)
		if err != nil {
			c.Status(http.StatusBadRequest)
			return
		}
		controller.SetActor(seeker)
		controller.SetTargetRotation(rotation)
		c.Status(http.StatusOK)
	})

	router.GET("/find_zero", func(c *gin.Context) {
		logger.Info("GET", zap.String("path", c.FullPath()))
		detector := zero_detector.NewDetector(
			logger,
			sensor,
			motorCfg.NumSteps,
			motorCfg.DirectionChangePauses,
		)
		controller.SetActor(detector)
		c.Status(http.StatusOK)
	})

	router.GET("/status", func(c *gin.Context) {
		logger.Info("GET", zap.String("path", c.FullPath()))

		state := controller.GetState()

		c.JSON(http.StatusOK, &schema.HeadResult{
			Result:     "ok",
			Position:   state.Pos,
			Rotation:   state.Rotation(),
			Controller: state.ActorName,
			StepsAway:  0,
			Eta:        0,
		})
	})
}
