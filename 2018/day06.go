package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Point struct {
	x, y int
}

func main() {
	points := readPointsFromFile("input.txt")
	if len(points) == 0 {
		fmt.Println("No valid points found in input file.")
		return
	}

	minX, minY, maxX, maxY := findBoundingBox(points)

	largestArea := partOne(points, minX, minY, maxX, maxY)
	regionSize := partTwo(points, minX, minY, maxX, maxY, 10000)

	fmt.Println("The size of the largest area that isn't infinite is:", largestArea)
	fmt.Println("The size of the region with total distance < 10000 is:", regionSize)
}

func readPointsFromFile(filename string) []Point {
	file, err := os.Open(filename)
	if err != nil {
		fmt.Println("Error opening file: ", err)
		return nil
	}
	defer file.Close()

	var points []Point
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		coords := strings.Split(line, ", ")
		if len(coords) != 2 {
			fmt.Println("Invalid input line: ", line)
			continue
		}
		x, err1 := strconv.Atoi(coords[0])
		y, err2 := strconv.Atoi(coords[1])
		if err1 != nil || err2 != nil {
			fmt.Println("Error parsing coordinates: ", line)
			continue
		}
		points = append(points, Point{x, y})
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading file: ", err)
		return nil
	}

	return points
}

func findBoundingBox(points []Point) (minX, minY, maxX, maxY int) {
	minX, minY = points[0].x, points[0].y
	maxX, maxY = points[0].x, points[0].y

	for _, p := range points {
		if p.x < minX {
			minX = p.x
		}
		if p.x > maxX {
			maxX = p.x
		}
		if p.y < minY {
			minY = p.y
		}
		if p.y > maxY {
			maxY = p.y
		}

	}
	return
}

func partOne(points []Point, minX, minY, maxX, maxY int) int {
	areaCount := make(map[Point]int)
	infinite := make(map[Point]bool)

	for x := minX; x <= maxX; x++ {
		for y := minY; y < maxY; y++ {
			closest, tied := findClosestPoint(Point{x, y}, points)
			if !tied {
				areaCount[closest]++
				if x == minX || x == maxX || y == minY || y == maxY {
					infinite[closest] = true
				}
			}
		}
	}

	largestArea := 0
	for p, count := range areaCount {
		if !infinite[p] && count > largestArea {
			largestArea = count
		}
	}

	return largestArea
}

func partTwo(points []Point, minX, minY, maxX, maxY, maxDistance int) int {
	regionSize := 0

	for x := minX; x <= maxX; x++ {
		for y := minY; y <= maxY; y++ {
			totalDistance := 0
			for _, p := range points {
				totalDistance += manhattanDistance(Point{x, y}, p)
			}
			if totalDistance < maxDistance {
				regionSize++
			}
		}
	}

	return regionSize
}

func findClosestPoint(p Point, points []Point) (closest Point, tied bool) {
	minDist := int(^uint(0) >> 1)
	for _, pt := range points {
		dist := manhattanDistance(p, pt)
		if dist < minDist {
			minDist = dist
			closest = pt
			tied = false
		} else if dist == minDist {
			tied = true
		}
	}
	return
}

func manhattanDistance(a, b Point) int {
	return abs(a.x-b.x) + abs(a.y-b.y)
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}