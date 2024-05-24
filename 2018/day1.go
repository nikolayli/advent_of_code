package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

func partOne(changes []int) int {
	resultingFrequency := 0
	for _, change := range changes {
		resultingFrequency += change
	}

	return resultingFrequency
}

func partTwo(changes []int) int {
	seenFrequencies := make(map[int]struct{})
	currentFrequency := 0
	seenFrequencies[currentFrequency] = struct{}{}

	for {
		for _, change := range changes {
			currentFrequency += change
			if _, exists := seenFrequencies[currentFrequency]; exists {
				return currentFrequency
			}
			seenFrequencies[currentFrequency] = struct{}{}
		}
	}
}

func readChanges(filePath string) ([]int, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("error opening file: %w", err)
	}
	defer file.Close()

	var changes []int
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		text := scanner.Text()
		if text == "" {
			continue
		}
		value, err := strconv.Atoi(text)
		if err != nil {
			return nil, fmt.Errorf("error reading integer from file: %v, on line: %s", err, text)
		}
		changes = append(changes, value)
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("error reading file: %w", err)
	}

	return changes, nil
}

func main() {
	changes, err := readChanges("input.txt")
	if err != nil {
		fmt.Println(err)
		return
	}

	resultingFrequency := partOne(changes)
	firstDuplicateFrequency := partTwo(changes)

	fmt.Printf("Resulting frequency: %d\n", resultingFrequency)
	fmt.Printf("First frequency reached twice: %d\n", firstDuplicateFrequency)
}