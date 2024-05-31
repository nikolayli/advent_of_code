package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

func compareIDs(id1, id2 string) (string, int) {
	diffCount := 0
	var commonLetters strings.Builder

	for i := range id1 {
		if id1[i] != id2[i] {
			diffCount++
		} else {
			commonLetters.WriteByte(id1[i])
		}
	}

	return commonLetters.String(), diffCount
}

func partOne(boxIDs []string) int {
	twiceCount, thriceCount := 0, 0

	for _, id := range boxIDs {
		letterCounts := make(map[rune]int)
		for _, letter := range id {
			letterCounts[letter]++
		}

		foundTwice, foundThrice := false, false
		for _, count := range letterCounts {
			if count == 2 && !foundTwice {
				twiceCount++
				foundTwice = true
			} else if count == 3 && !foundThrice {
				thriceCount++
				foundThrice = true
			}
		}
	}

	return twiceCount * thriceCount
}

func partTwo(boxIDs []string) string {
	for i, id1 := range boxIDs {
		for _, id2 := range boxIDs[i+1:] {
			commonLetters, diffCount := compareIDs(id1, id2)
			if diffCount == 1 {
				return commonLetters
			}
		}
	}

	return ""
}

func readBoxIDs(filename string) ([]string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var boxIDs []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line != "" {
			boxIDs = append(boxIDs, line)
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return boxIDs, nil
}

func main() {
	boxIDs, err := readBoxIDs("input.txt")
	if err != nil {
		log.Fatalf("Failed to read box IDs: %v", err)
	}

	checksum := partOne(boxIDs)
	commonLetters := partTwo(boxIDs)

	fmt.Printf("Checksum for your list of box ID: %d\n", checksum)
	fmt.Printf("Common letters between the two correct box IDs: %s\n", commonLetters)

}