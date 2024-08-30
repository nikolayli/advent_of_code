package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Node struct {
	value int
	prev  *Node
	next  *Node
}

func main() {
	numPlayers, lastMarble, err := readInput("input.txt")
	if err != nil {
		fmt.Println("Error reading input: ", err)
		return
	}

	highScore := playGame(numPlayers, lastMarble)
	fmt.Println("Part One: The highest score is:", highScore)

	highScore = playGame(numPlayers, lastMarble*100)
	fmt.Println("Part Two: The highest score is:", highScore)
}

func readInput(filename string) (int, int, error) {
	file, err := os.Open(filename)
	if err != nil {
		return 0, 0, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	scanner.Scan()
	input := scanner.Text()

	parts := strings.Fields(input)
	numPlayers, err := strconv.Atoi(parts[0])
	if err != nil {
		return 0, 0, err
	}
	lastMarble, err := strconv.Atoi(parts[6])
	if err != nil {
		return 0, 0, err
	}

	return numPlayers, lastMarble, nil
}

func playGame(numPlayers, lastMarble int) int {
	scores := make([]int, numPlayers)
	current := &Node{value: 0}
	current.next = current
	current.prev = current

	for marble := 1; marble <= lastMarble; marble++ {
		if marble%23 == 0 {
			player := (marble - 1) % numPlayers
			scores[player] += marble
			for i := 0; i < 7; i++ {
				current = current.prev
			}
			scores[player] += current.value
			current = current.remove()
		} else {
			current = current.next
			current = current.insertAfter(marble)
		}
	}

	highScore := 0
	for _, score := range scores {
		if score > highScore {
			highScore = score
		}
	}

	return highScore
}

func (n *Node) insertAfter(value int) *Node {
	newNode := &Node{value: value, prev: n, next: n.next}
	n.next.prev = newNode
	n.next = newNode
	
	return newNode
}

func (n *Node) remove() *Node {
	n.prev.next = n.next
	n.next.prev = n.prev

	return n.next
}