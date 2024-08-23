package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Node struct {
	children []Node
	metadata []int
}

func main() {
	data, err := readInput("input.txt")
	if err != nil {
		fmt.Println("Error reading input: ", err)
		return
	}

	root, _ := parseNode(data, 0)

	metadataSum := partOne(root)
	rootValue := partTwo(root)

	fmt.Println("Sum of all metadata entries:", metadataSum)
	fmt.Println("Value of the root node:", rootValue)
}

func readInput(filename string) ([]int, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	scanner.Scan()
	line := scanner.Text()

	strData := strings.Fields(line)
	data := make([]int, len(strData))
	for i, str := range strData {
		data[i], err = strconv.Atoi(str)
		if err != nil {
			return nil, err
		}
	}

	return data, scanner.Err()
}

func parseNode(data []int, index int) (Node, int) {
	numChildren := data[index]
	numMetadata := data[index+1]
	index += 2

	node := Node{
		children: make([]Node, numChildren),
		metadata: make([]int, numMetadata),
	}

	for i := 0; i < numChildren; i++ {
		node.children[i], index = parseNode(data, index)
	}

	for i := 0; i < numMetadata; i++ {
		node.metadata[i] = data[index]
		index++
	}

	return node, index
}

func partOne(node Node) int {
	sum := 0

	for _, m := range node.metadata {
		sum += m
	}
	for _, child := range node.children {
		sum += partOne(child)
	}

	return sum
}

func partTwo(node Node) int {
	if len(node.children) == 0 {
		sum := 0
		for _, m := range node.metadata {
			sum += m
		}
		return sum
	}

	value := 0
	for _, m := range node.metadata {
		if m > 0 && m <= len(node.children) {
			value += partTwo(node.children[m-1])
		}
	}

	return value
}