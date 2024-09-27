package main

import (
	"fmt"
	"strconv"
)

func main() {
	input := "824501"

	partOneResult := generateRecipes(input, 1)
	partTwoResult := generateRecipes(input, 2)

	fmt.Println("Rating of ten recipes after input data: ", partOneResult)
	fmt.Println("Number of recipes that appear: ", partTwoResult)
}

func generateRecipes(target string, part int) string {
	scoreboard := []int{3, 7}
	elf1, elf2 := 0, 1
	targetLen := len(target)
	targetInt, _ := strconv.Atoi(target)

	targetSlice := make([]int, targetLen)
	for i := 0; i < targetLen; i++ {
		targetSlice[i] = int(target[i] - '0')
	}

	addRecipes := func(score1, score2 int) {
		sum := score1 + score2
		if sum >= 10 {
			scoreboard = append(scoreboard, sum/10)
		}
		scoreboard = append(scoreboard, sum%10)
	}

	moveElves := func() {
		elf1 = (elf1 + 1 + scoreboard[elf1]) % len(scoreboard)
		elf2 = (elf2 + 1 + scoreboard[elf2]) % len(scoreboard)
	}

	checkTarget := func() (bool, int) {
		if len(scoreboard) >= targetLen {
			if slicesEqual(scoreboard[len(scoreboard)-targetLen:], targetSlice) {
				return true, len(scoreboard) - targetLen
			}
		}
		if len(scoreboard) > targetLen {
			if slicesEqual(
				scoreboard[len(scoreboard)-targetLen-1:len(scoreboard)-1], 
				targetSlice,
			) {
				return true, len(scoreboard) - targetLen - 1
			}
		}
		return false, 0
	}

	for {
		addRecipes(scoreboard[elf1], scoreboard[elf2])
		moveElves()

		if part == 2 {
			if found, index := checkTarget(); found {
				return strconv.Itoa(index)
			}
		} else if len(scoreboard) >= targetInt+10 {
			break
		}
	}

	result := ""
	for i := targetInt; i < targetInt+10; i++ {
		result += strconv.Itoa(scoreboard[i])
	}

	return result
}

func slicesEqual(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}

	return true
}