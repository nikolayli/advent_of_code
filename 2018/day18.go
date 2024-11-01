package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

const (
	openGround = '.'
	trees      = '|'
	lumberyard = '#'
)

func main() {
	initialState := readInput("input.txt")

	finalState10 := simulate(initialState, 10)
	resourceValue10 := calculateResourceValue(finalState10)
	fmt.Println("Resource Value after 10 minutes:", resourceValue10)

	finalState1b := simulateWithCycleDetection(initialState, 1000000000)
	resourceValue1b := calculateResourceValue(finalState1b)
	fmt.Println("Resource Value after 1,000,000,000 minutes:", resourceValue1b)
}

func readInput(filename string) [][]rune {
	file, err := os.Open(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	var grid [][]rune
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if line != "" {
			grid = append(grid, []rune(line))
		}
	}

	if err := scanner.Err(); err != nil {
		panic(err)
	}

	return grid
}

func simulate(grid [][]rune, minutes int) [][]rune {
	rows := len(grid)
	cols := len(grid[0])
	for minute := 0; minute < minutes; minute++ {
		newGrid := make([][]rune, rows)
		for i := range newGrid {
			newGrid[i] = make([]rune, cols)
			copy(newGrid[i], grid[i])
		}

		for r := 0; r < rows; r++ {
			for c := 0; c < cols; c++ {
				newGrid[r][c] = getNextState(grid, r, c)
			}
		}
		grid = newGrid
	}

	return grid
}

func getNextState(grid [][]rune, r, c int) rune {
	rows := len(grid)
	cols := len(grid[0])
	adjacent := make(map[rune]int)
	for dr := -1; dr <= 1; dr++ {
		for dc := -1; dc <= 1; dc++ {
			if dr == 0 && dc == 0 {
				continue
			}
			nr, nc := r+dr, c+dc
			if nr >= 0 && nr < rows && nc >= 0 && nc < cols {
				adjacent[grid[nr][nc]]++
			}
		}
	}

	switch grid[r][c] {
	case openGround:
		if adjacent[trees] >= 3 {
			return trees
		}
	case trees:
		if adjacent[lumberyard] >= 3 {
			return lumberyard
		}
	case lumberyard:
		if adjacent[lumberyard] >= 1 && adjacent[trees] >= 1 {
			return lumberyard
		}
		return openGround
	}

	return grid[r][c]
}

func calculateResourceValue(grid [][]rune) int {
	wooded := 0
	lumberyards := 0
	for _, row := range grid {
		for _, acre := range row {
			switch acre {
			case trees:
				wooded++
			case lumberyard:
				lumberyards++
			}
		}
	}
	
	return wooded * lumberyards
}

func simulateWithCycleDetection(grid [][]rune, minutes int) [][]rune {
	seen := make(map[string]int)
	var states []string
	rows := len(grid)
	cols := len(grid[0])

	for minute := 0; minute < minutes; minute++ {
		newGrid := make([][]rune, rows)
		for i := range newGrid {
			newGrid[i] = make([]rune, cols)
			copy(newGrid[i], grid[i])
		}

		for r := 0; r < rows; r++ {
			for c := 0; c < cols; c++ {
				newGrid[r][c] = getNextState(grid, r, c)
			}
		}

		grid = newGrid
		stateStr := gridToString(grid)
		if prevMinute, found := seen[stateStr]; found {
			cycleLength := minute - prevMinute
			remainingMinutes := (minutes - minute - 1) % cycleLength
			return stringToGrid(states[prevMinute+remainingMinutes])
		}

		seen[stateStr] = minute
		states = append(states, stateStr)
	}

	return grid
}

func gridToString(grid [][]rune) string {
	var result string
	for _, row := range grid {
		result += string(row) + "\n"
	}
	return result
}

func stringToGrid(stateStr string) [][]rune {
	var grid [][]rune
	scanner := bufio.NewScanner(strings.NewReader(stateStr))
	for scanner.Scan() {
		line := scanner.Text()
		grid = append(grid, []rune(line))
	}
	return grid
}