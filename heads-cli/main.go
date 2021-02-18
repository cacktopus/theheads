package main

import (
	"github.com/spf13/cobra"
)

func main() {
	logsCmd := &cobra.Command{
		Use:   "logs",
		Short: "stream logs",
		RunE:  logs,
	}

	rootCmd := &cobra.Command{
		Use: "heads-cli",
	}

	rootCmd.AddCommand(logsCmd)

	err := rootCmd.Execute()
	if err != nil {
		panic(err)
	}
}
