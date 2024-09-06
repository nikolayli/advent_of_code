package main

import (
	"fmt"
	"math"
)

const gridSize = 300

func main() {
	serial := 5235

	grid := InitializeGrid(serial)

	x, y, _, power := FindMaxPowerSquare(grid, 3)
	fmt.Printf("The top-left coordinate of the 3x3 square with the largest total power is %d,%d with a total power of %d\n", x, y, power)

	x, y, size, power := FindMaxPowerSquare(grid, gridSize)
	fmt.Printf("The top-left coordinate of the square with the largest total power is %d,%d,%d with a total power of %d\n", x, y, size, power)
}

func InitializeGrid(serial int) [][]int {
	grid := make([][]int, gridSize)
	for i := range grid {
		grid[i] = make([]int, gridSize)
	}

	for y := 1; y <= gridSize; y++ {
		for x := 1; x <= gridSize; x++ {
			grid[y-1][x-1] = CalculatePowerLevel(x, y, serial)
		}
	}

	return grid
}

func CalculatePowerLevel(x, y, serial int) int {
	rackID := x + 10
	powerLevel := rackID * y
	powerLevel += serial
	powerLevel *= rackID
	powerLevel = (powerLevel / 100) % 10
	powerLevel -= 5
	return powerLevel
}

func FindMaxPowerSquare(grid [][]int, maxSquareSize int) (int, int, int, int) {
	sat := BuildSummedAreaTable(grid)
	maxPower := math.MinInt32
	var maxX, maxY, maxSize int

	for size := 1; size <= maxSquareSize; size++ {
		for y := 0; y <= gridSize-size; y++ {
			for x := 0; x <= gridSize-size; x++ {
				totalPower := GetSquareSum(sat, x, y, size)
				if totalPower > maxPower {
					maxPower = totalPower
					maxX = x + 1
					maxY = y + 1
					maxSize = size
				}
			}
		}
	}

	return maxX, maxY, maxSize, maxPower
}

func BuildSummedAreaTable(grid [][]int) [][]int {
	sat := make([][]int, gridSize)
	for i := range sat {
		sat[i] = make([]int, gridSize)
	}

	for y := 0; y < gridSize; y++ {
		for x := 0; x < gridSize; x++ {
			sat[y][x] = grid[y][x]
			if x > 0 {
				sat[y][x] += sat[y][x-1]
			}
			if y > 0 {
				sat[y][x] += sat[y-1][x]
			}
			if x > 0 && y > 0 {
				sat[y][x] -= sat[y-1][x-1]
			}
		}
	}

	return sat
}

func GetSquareSum(sat [][]int, x, y, size int) int {
	x1, y1 := x-1, y-1
	x2, y2 := x+size-1, y+size-1

	sum := sat[y2][x2]
	if x1 >= 0 {
		sum -= sat[y2][x1]
	}
	if y1 >= 0 {
		sum -= sat[y1][x2]
	}
	if x1 >= 0 && y1 >= 0 {
		sum += sat[y1][x1]
	}
	
	return sum
}