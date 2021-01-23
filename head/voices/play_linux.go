package voices

import (
	"fmt"
)

func execPlay(deviceName string) []string {
	return []string{
		"aplay", "--device", fmt.Sprintf("default:CARD=%s", deviceName),
	}
}
