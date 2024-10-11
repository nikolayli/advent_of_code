package main

import (
	"bufio"
	"fmt"
	"image"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"
)

const (
	Sand    = 0
	Clay    = 1
	Water   = 2
	Flowing = Water
	Settled = Clay | Water
)

type Field [][]int

type ScanData struct {
	Bounds image.Rectangle
	Lines  []image.Rectangle
}

func main() {
	input := readInput("input.txt")
	scanData := parseInput(input)
	field := simulateWaterFlow(scanData)

	reachableTiles := partOne(scanData, field)
	fmt.Println(
		"Water will reach tiles in a range of y values when scanning:",
		reachableTiles,
	)

	retainedWater := partTwo(scanData, field)
	fmt.Println(
		"Tiles of water will remain after the water source stops producing water:",
		retainedWater,
	)
}

func readInput(filename string) string {
	file, err := os.Open(filename)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	var sb strings.Builder
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		sb.WriteString(scanner.Text() + "\n")
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	return sb.String()
}

func parseInput(input string) ScanData {
	lines := strings.Split(strings.TrimSpace(input), "\n")
	regex := regexp.MustCompile(`(\w)=(\d+), (\w)=(\d+)\.\.(\d+)`)

	var bounds image.Rectangle
	var clayLines []image.Rectangle

	for _, line := range lines {
		matches := regex.FindStringSubmatch(line)
		if len(matches) == 0 {
			continue
		}
		x, _ := strconv.Atoi(matches[2])
		y1, _ := strconv.Atoi(matches[4])
		y2, _ := strconv.Atoi(matches[5])
		var rect image.Rectangle
		if matches[1] == "x" {
			rect = image.Rect(x, y1, x+1, y2+1)
		} else {
			rect = image.Rect(y1, x, y2+1, x+1)
		}
		if len(clayLines) == 0 {
			bounds = rect
		} else {
			bounds = rect.Union(bounds)
		}
		clayLines = append(clayLines, rect)
	}
	bounds.Min.Y--
	bounds.Min.X--
	bounds.Max.X++

	return ScanData{Bounds: bounds, Lines: clayLines}
}

func partOne(scanData ScanData, field Field) int {
	count := 0
	for _, row := range field {
		for _, cell := range row {
			if cell&Water != 0 {
				count++
			}
		}
	}
	return count
}

func partTwo(scanData ScanData, field Field) int {
	count := 0
	for _, row := range field {
		for _, cell := range row {
			if cell == Settled {
				count++
			}
		}
	}
	return count
}

func simulateWaterFlow(scanData ScanData) Field {
	field := initializeField(scanData)
	nextPoints := []image.Point{{500 - scanData.Bounds.Min.X, 0}}
	currentPoints := []image.Point{}

	for len(nextPoints) > 0 {
		currentPoints, nextPoints = nextPoints, currentPoints[:0]
		for _, point := range currentPoints {
			if field[point.Y][point.X]&Clay != 0 {
				continue
			}

			field[point.Y][point.X] = Flowing

			if point.Y == len(field)-1 {
				field[point.Y][point.X] = Flowing
				continue
			}

			switch field[point.Y+1][point.X] {
			case Sand:
				nextPoints = append(nextPoints, image.Pt(point.X, point.Y+1))
				continue
			case Flowing:
				continue
			case Clay, Settled:
				left, right := -1, -1
				for x := point.X + 1; ; x++ {
					if field[point.Y][x]&Clay == 0 {
						field[point.Y][x] = Flowing
						if field[point.Y+1][x]&Clay == 0 {
							nextPoints = append(nextPoints, image.Pt(x, point.Y+1))
							break
						}
					} else {
						right = x
						break
					}
				}
				for x := point.X - 1; ; x-- {
					if field[point.Y][x]&Clay == 0 {
						field[point.Y][x] = Flowing
						if field[point.Y+1][x]&Clay == 0 {
							nextPoints = append(nextPoints, image.Pt(x, point.Y+1))
							break
						}
					} else {
						left = x
						break
					}
				}
				if left >= 0 && right >= 0 {
					for x := left + 1; x < right; x++ {
						field[point.Y][x] = Settled
						if field[point.Y-1][x]&Water != 0 {
							nextPoints = append(nextPoints, image.Pt(x, point.Y-1))
						}
					}
				}
			}
		}
	}

	return field[1:]
}

func initializeField(scanData ScanData) Field {
	field := make(Field, 0, scanData.Bounds.Dy())
	for y := scanData.Bounds.Min.Y; y < scanData.Bounds.Max.Y; y++ {
		field = append(field, make([]int, scanData.Bounds.Dx()))
	}
	for _, line := range scanData.Lines {
		for y := line.Min.Y; y < line.Max.Y; y++ {
			for x := line.Min.X; x < line.Max.X; x++ {
				field[y-scanData.Bounds.Min.Y][x-scanData.Bounds.Min.X] = Clay
			}
		}
	}
	return field
}