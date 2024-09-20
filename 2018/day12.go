package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
)

type Pot struct {
	index int
	plant bool
}

type Rule struct {
	state  []bool
	effect bool
}

func main() {
	lines, err := readInput("input.txt")
	if err != nil {
		log.Fatalf("Unable to read input file: %v", err)
	}

	pots, rules := parseInput(lines)

	sum20 := partOne(pots, rules)
	fmt.Printf("Sum of pot numbers after 20 generations: %d\n", sum20)

	sum50B := partTwo(pots, rules)
	fmt.Printf("Sum of pot numbers after 50 billion generations: %d\n", sum50B)
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

func parseInput(lines []string) ([]Pot, []Rule) {
	pots := []Pot{}
	rules := []Rule{}

	for _, line := range lines {
		if len(line) >= 14 && line[:14] == "initial state:" {
			potState := line[15:]
			for index, char := range potState {
				pots = append(pots, Pot{
					index: index,
					plant: char == '#',
				})
			}
		} else if len(line) > 0 {
			var state string
			var effect string
			fmt.Sscanf(line, "%s => %s", &state, &effect)

			rule := Rule{
				effect: effect == "#",
			}

			for _, s := range state {
				rule.state = append(rule.state, s == '#')
			}

			rules = append(rules, rule)
		}
	}

	return pots, rules
}

func partOne(pots []Pot, rules []Rule) int {
	for i := 1; i <= 20; i++ {
		pots = computeNextGeneration(pots, rules)
	}
	return computeTotalSum(pots)
}

func partTwo(pots []Pot, rules []Rule) int {
	for i := 1; i <= 1000; i++ {
		pots = computeNextGeneration(pots, rules)
	}
	sum1 := computeTotalSum(pots)

	for i := 1; i <= 50; i++ {
		pots = computeNextGeneration(pots, rules)
	}
	sum2 := computeTotalSum(pots)

	staticEvolution := sum2 - sum1
	return staticEvolution*(1000000000-20) + sum1
}

func computeNextGeneration(pots []Pot, rules []Rule) []Pot {
	state := []bool{}
	pots = addEmptyPots(pots)

	for idx, pot := range pots {
		state = append(state, pot.plant)

		match := false
		for _, rule := range rules {
			if stateMatches(rule.state, state) {
				pots[idx-2].plant = rule.effect
				match = true
				break
			}
		}

		if !match && idx > 2 {
			pots[idx-2].plant = false
		}

		if len(state) == 5 {
			state = state[1:]
		}
	}

	pots = arrangePots(pots)

	return pots
}

func computeTotalSum(pots []Pot) int {
	total := 0
	for _, pot := range pots {
		if pot.plant {
			total += pot.index
		}
	}
	return total
}

func addEmptyPots(pots []Pot) []Pot {
	firstIndex := pots[0].index

	for i := -4; i < 0; i++ {
		pots = push(pots, Pot{
			index: firstIndex + i,
			plant: false,
		})
	}

	for i := 1; i < 5; i++ {
		pots = append(pots, Pot{
			index: pots[len(pots)-1].index + i,
			plant: false,
		})
	}

	return pots
}

func stateMatches(a, b []bool) bool {
	if len(a) != len(b) {
		return false
	}
	for idx := range a {
		if a[idx] != b[idx] {
			return false
		}
	}
	return true
}

func arrangePots(pots []Pot) []Pot {
	for fIdx := range pots {
		if pots[fIdx].index == 0 {
			for idx := range pots {
				pots[idx].index = idx - fIdx
			}
			break
		}
	}
	return pots
}

func push(pots []Pot, p Pot) []Pot {
	return append([]Pot{p}, pots...)
}