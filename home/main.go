package main

import (
	"fmt"
	"github.com/hashicorp/consul/api"
)

func main() {
	client, err := api.NewClient(api.DefaultConfig())
	if err != nil {
		panic(err)
	}
	fmt.Println("client", client)

	members, err := client.Agent().Members(false)
	if err != nil {
		panic(err)
	}
	for i, member := range members {
		fmt.Println("member", i, member)
	}

	fmt.Println("")

	nodes, _, err := client.Catalog().Nodes(nil)
	if err != nil {
		panic(err)
	}
	for i, node := range nodes {
		fmt.Println("node", i, node)
		fmt.Println(node.Address, node.ID, node.Node)
	}

	services, _, err := client.Catalog().Services(nil)
	if err != nil {
		panic(err)
	}

	fmt.Println("")

	for service, tags := range services {
		fmt.Println("service:", service, tags)

		svc, _, err := client.Catalog().Service(service, "", nil)
		if err != nil {
			panic(err)
		}
		for j, node := range svc {
			fmt.Println("  ", j, node.Node, node.Address, node.ServicePort,
				node.ServiceID, node.ServiceName, node.ServiceTags,
			)
		}
	}

}
