package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type Point struct {
	x, y int
}

var directions = map[byte]Point {
	'N': {0, -1},
	'S': {0, 1},
	'E': {1, 0},
	'W': {-1, 0},
}

func main() {
	lines, err := readInput("input.txt")
	if err != nil {
		panic(err)
	}

	regex := strings.Trim(lines[0], "^$")

	rooms := make(map[Point]bool)
	doors := make(map[Point]map[Point]bool)
	start := Point{0, 0}
	rooms[start] = true

	buildMap(regex, start, rooms, doors)

	distances := bfs(start, rooms, doors)

	shortestPath, rooms1000dors := analyzeDistances(distances)
	fmt.Println("Furthest room distance:", shortestPath)
  fmt.Println("Rooms with distance >= 1000:", rooms1000dors)
}

func readInput(filename string) ([]string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	return lines, scanner.Err()
}

func buildMap(
	regex string, start Point, 
	rooms map[Point]bool, 
	doors map[Point]map[Point]bool,
) Point {
	stack := []Point{start}
	current := start

	for i := 0; i < len(regex); i++ {
		switch regex[i] {
		case 'N', 'S', 'E', 'W':
			dir := directions[regex[i]]
			next := Point{current.x + dir.x, current.y + dir.y}
			if !rooms[next] {
				rooms[next] = true
			}
			if doors[current] == nil {
				doors[current] = make(map[Point]bool)
			}
			if doors[next] == nil {
				doors[next] = make(map[Point]bool)
			}
			doors[current][next] = true
			doors[next][current] = true
			current = next
		case '(':
			stack = append(stack, current)
		case ')':
			current = stack[len(stack)-1]
			stack = stack[:len(stack)-1]
		case '|':
			current = stack[len(stack)-1]
		}
	}

	return current
}

func bfs(
	start Point, rooms map[Point]bool, doors map[Point]map[Point]bool,
) map[Point]int {
	distances := make(map[Point]int)
	queue := []Point{start}
	distances[start] = 0

	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]

		for next := range doors[current] {
			if _, visited := distances[next]; !visited {
				distances[next] = distances[current] + 1
				queue = append(queue, next)
			}
		}
	}

	return distances
}

func analyzeDistances(distances map[Point]int) (int, int) {
	maxDistance := 0
	count1000 := 0

	for _, dist := range distances {
		if dist > maxDistance {
			maxDistance = dist
		}
		if dist >= 1000 {
			count1000++
		}
	}

	return maxDistance, count1000
}