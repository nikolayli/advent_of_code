package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"unicode"
)

func main() {
	polymer, err := readInput("input.txt")
	if err != nil {
		fmt.Println("Error reading input: ", err)
		return
	}

	reactedPolymer := partOne(polymer)
	shortestPolymerLength := findShortestPolymerLength(polymer)

	fmt.Println("Remaining units after full reaction:", len(reactedPolymer))
	fmt.Println("Length of the shortest polymer after removing problematic unit:", shortestPolymerLength)
}

func readInput(filename string) (string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return "", err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	scanner.Scan()

	return scanner.Text(), scanner.Err()
}

func partOne(polymer string) string {
	var stack []rune

	for _, unit := range polymer {
		if len(stack) > 0 && reacts(stack[len(stack)-1], unit) {
			stack = stack[:len(stack)-1]
		} else {
			stack = append(stack, unit)
		}
	}

	return string(stack)
}

func reacts(a, b rune) bool {
	return a != b && unicode.ToLower(a) == unicode.ToLower(b)
}

func removeUnit(polymer string, unit rune) string {
	unitLower := unicode.ToLower(unit)
	unitUpper := unicode.ToUpper(unit)
	return strings.Map(func(r rune) rune {
		if r == unitLower || r == unitUpper {
			return -1
		}
		return r
	}, polymer)
}

func findShortestPolymerLength(polymer string) int {
	unitTypes := make(map[rune]struct{})
	for _, unit := range polymer {
		unitTypes[unicode.ToLower(unit)] = struct{}{}
	}

	minLength := len(polymer)
	for unit := range unitTypes {
		modifiedPolymer := removeUnit(polymer, unit)
		reactedPolymer := partOne(modifiedPolymer)
		if len(reactedPolymer) < minLength {
			minLength = len(reactedPolymer)
		}
	}

	return minLength
}