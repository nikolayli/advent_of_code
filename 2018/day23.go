package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"sort"
	"strconv"
)

type Nanobot struct {
	x, y, z , r int
}

func main() {
	nanobots, err := readInput("input.txt")
	if err != nil {
		fmt.Println("Error reading input:", err)
		return
	}

	strongest := findStrongestnanobot(nanobots)
	count := countnanobotsInRange(nanobots, strongest)
	fmt.Println("Number of nanobots in range of the strongest nanobot:", count)

	bestPos := findOptimalCoordinate(nanobots)
	distance := abs(bestPos)
	fmt.Println(
		"Shortest Manhattan distance to the optimal coordinate:", distance,
	)
}

func readInput(filename string) ([]Nanobot, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var nanobots []Nanobot
	scanner := bufio.NewScanner(file)
	re := regexp.MustCompile(`pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)`)

	for scanner.Scan() {
		line := scanner.Text()
		matches := re.FindStringSubmatch(line)
		if len(matches) == 5 {
			x, _ := strconv.Atoi(matches[1])
			y, _ := strconv.Atoi(matches[2])
			z, _ := strconv.Atoi(matches[3])
			r, _ := strconv.Atoi(matches[4])
			nanobots = append(nanobots, Nanobot{x, y, z, r})
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return nanobots, nil
}

func findStrongestnanobot(nanobots []Nanobot) Nanobot {
	var strongest Nanobot
	for _, bot := range nanobots {
		if bot.r > strongest.r {
			strongest = bot
		}
	}
	return strongest
}

func countnanobotsInRange(nanobots []Nanobot, reference Nanobot) int {
	count := 0
	for _, bot := range nanobots {
		if manhattanDistance(reference, bot) <= reference.r {
			count++
		}
	}
	return count
}

func findOptimalCoordinate(nanobots []Nanobot) int {
	type Event struct {
		pos   int
		delta int
	}

	var events []Event
	for _, bot := range nanobots {
		events = append(events, Event{bot.x + bot.y + bot.z - bot.r, 1})
		events = append(events, Event{bot.x + bot.y + bot.z - bot.r + 1, -1})
	}

	sort.Slice(events, func(i, j int) bool {
		if events[i].pos == events[j].pos {
			return events[i].delta > events[j].delta
		}
		return events[i].pos < events[j].pos
	})

	maxCount := 0
	count := 0
	bestPos := 0
	for _, event := range events {
		count += event.delta
		if count > maxCount {
			maxCount = count
			bestPos = event.pos
		}
	}
	
	return bestPos
}

func manhattanDistance(a, b Nanobot) int {
	return abs(a.x-b.x) + abs(a.y-b.y) + abs(a.z-b.z)
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}