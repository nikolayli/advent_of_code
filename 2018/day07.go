package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strings"
)

func main() {
	lines, err := readInput("input.txt")
	if err != nil {
		fmt.Println("Error reading input: ", err)
		return
	}

	graph, inDegree := parseInstructions(lines)
	numWorkers := 5
	baseTime := 60

	order := partOne(graph, inDegree)
	time := partTwo(graph, inDegree, numWorkers, baseTime)

	fmt.Println("Order of steps:", order)
	fmt.Println("Time to complete all steps with", numWorkers, "workers:", time)
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

func parseInstructions(lines []string) (map[rune][]rune, map[rune]int) {
	graph := make(map[rune][]rune)
	inDegree := make(map[rune]int)

	for _, line := range lines {
		if line == "" {
			continue
		}
		parts := strings.Fields(line)
		before := rune(parts[1][0])
		after := rune(parts[7][0])

		graph[before] = append(graph[before], after)
		inDegree[after]++
		if _, exists := inDegree[before]; !exists {
			inDegree[before] = 0
		}
	}

	return graph, inDegree
}

func partOne(graph map[rune][]rune, inDegree map[rune]int) string {
	inDegreeCopy := copyMap(inDegree)
	var order []rune
	available := getAvailableNodes(inDegreeCopy)

	for len(available) > 0 {
		current := available[0]
		available = available[1:]
		order = append(order, current)


		for _, neighbor := range graph[current] {
			inDegreeCopy[neighbor]--
			if inDegreeCopy[neighbor] == 0 {
				available = append(available, neighbor)
			}
		}

		sort.Slice(available, func(i, j int) bool {
			return available[i] < available[j]
		})
	}	

	return string(order)
}

func partTwo(graph map[rune][]rune, inDegree map[rune]int, 
	numWorkers, baseTime int) int {
	inDegreeCopy := copyMap(inDegree)
	available := getAvailableNodes(inDegreeCopy)
	workers := make([]int, numWorkers)
	workerTasks := make([]rune, numWorkers)
	time := 0
	done := make(map[rune]bool)

	for len(done) < len(inDegree) {
		for i := 0; i < numWorkers; i++ {
			if workers[i] == 0 && len(available) > 0 {
				task := available[0]
				available = available[1:]
				workers[i] = baseTime + int(task-'A'+1)
				workerTasks[i] = task
			}
		}

		minTime := minNonZero(workers)
		time += minTime
		for i := 0; i < numWorkers; i++ {
			if workers[i] > 0 {
				workers[i] -= minTime
				if workers[i] == 0 {
					task := workerTasks[i]
					done[task] = true
					for _, neighbor := range graph[task] {
						inDegreeCopy[neighbor]--
						if inDegreeCopy[neighbor] == 0 {
							available = append(available, neighbor)
						}
					}
					sort.Slice(available, func(i, j int) bool {
						return available[i] < available[j]
					})
				}
			}
		}
	}

	return time
}

func copyMap(original map[rune]int) map[rune]int {
	copy := make(map[rune]int)
	for k, v := range original {
		copy[k] = v
	}

	return copy
}

func getAvailableNodes(inDegree map[rune]int) []rune {
	var available []rune
	for node, degree := range inDegree {
		if degree == 0 {
			available = append(available, node)
		}
	}
	sort.Slice(available, func(i, j int) bool {
		return available[i] < available[j]
	})

	return available
}

func minNonZero(arr []int) int {
	min := int(^uint(0) >> 1)
	for _, v := range arr {
		if v > 0 && v < min {
			min = v
		}
	}

	return min
}