package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type OpCode interface {
	Apply(r []int)
}

type addr struct { a, b, c int }
func (op addr) Apply(r []int) { r[op.c] = r[op.a] + r[op.b] }

type addi struct { a, b, c int }
func (op addi) Apply(r []int) { r[op.c] = r[op.a] + op.b }

type mulr struct { a, b, c int }
func (op mulr) Apply(r []int) { r[op.c] = r[op.a] * r[op.b] }

type muli struct { a, b, c int }
func (op muli) Apply(r []int) { r[op.c] = r[op.a] * op.b }

type banr struct { a, b, c int }
func (op banr) Apply(r []int) { r[op.c] = r[op.a] & r[op.b] }

type bani struct { a, b, c int }
func (op bani) Apply(r []int) { r[op.c] = r[op.a] & op.b }

type borr struct { a, b, c int }
func (op borr) Apply(r []int) { r[op.c] = r[op.a] | r[op.b] }

type bori struct { a, b, c int }
func (op bori) Apply(r []int) { r[op.c] = r[op.a] | op.b }

type setr struct { a, b, c int }
func (op setr) Apply(r []int) { r[op.c] = r[op.a] }

type seti struct { a, b, c int }
func (op seti) Apply(r []int) { r[op.c] = op.a }

type gtir struct { a, b, c int }
func (op gtir) Apply(r []int) {
	if op.a > r[op.b] {
		r[op.c] = 1
	} else {
		r[op.c] = 0
	} 
}

type gtri struct { a, b, c int }
func (op gtri) Apply(r []int) {
	if r[op.a] > op.b {
		r[op.c] = 1
	} else {
		r[op.c] = 0
	} 
}

type gtrr struct { a, b, c int }
func (op gtrr) Apply(r []int) {
	if r[op.a] > r[op.b] {
		r[op.c] = 1
	} else {
		r[op.c] = 0
	} 
}

type eqir struct { a, b, c int }
func (op eqir) Apply(r []int) {
	if op.a == r[op.b] {
		r[op.c] = 1
	} else {
		r[op.c] = 0
	} 
}

type eqri struct { a, b, c int }
func (op eqri) Apply(r []int) {
	if r[op.a] == op.b {
		r[op.c] = 1
	} else {
		r[op.c] = 0
	} 
}

type eqrr struct { a, b, c int }
func (op eqrr) Apply(r []int) {
	if r[op.a] == r[op.b] {
		r[op.c] = 1
	} else {
		r[op.c] = 0
	} 
}

func main() {
	lines, err := readInput("input.txt")
	if err != nil {
		panic(err)
	}

	ipReg, _ := strconv.Atoi(strings.Fields(lines[0])[1])
	var instructions []OpCode
	for _, line := range lines[1:] {
		instructions = append(instructions, createInstruction(line))
	}

	result1 := partOne(ipReg, instructions)
	fmt.Println("Fewest instructions halt value:", result1)

	result2 := partTwo(ipReg, instructions)
	fmt.Println("Most instructions halt value:", result2)
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
		line := scanner.Text()
		if strings.TrimSpace(line) != "" {
			lines = append(lines, line)
		}
	}

	return lines, scanner.Err()
}

func createInstruction(line string) OpCode {
	parts := strings.Fields(line)
	a, _ := strconv.Atoi(parts[1])
	b, _ := strconv.Atoi(parts[2])
	c, _ := strconv.Atoi(parts[3])

	switch parts[0] {
	case "addr":
		return addr{a, b, c}
	case "addi":
		return addi{a, b, c}
	case "mulr":
		return mulr{a, b, c}
	case "muli":
		return muli{a, b, c}
	case "banr":
		return banr{a, b, c}
	case "bani":
		return bani{a, b, c}
	case "borr":
		return borr{a, b, c}
	case "bori":
		return bori{a, b, c}
	case "setr":
		return setr{a, b, c}
	case "seti":
		return seti{a, b, c}
	case "gtir":
		return gtir{a, b, c}
	case "gtri":
		return gtri{a, b, c}
	case "gtrr":
		return gtrr{a, b, c}
	case "eqir":
		return eqir{a, b, c}
	case "eqri":
		return eqri{a, b, c}
	case "eqrr":
		return eqrr{a, b, c}
	}

	return nil
}

func partOne(ipReg int, instructions []OpCode) int {
	reg := make([]int, 6)
	
	for reg[ipReg] >= 0 && reg[ipReg] < len(instructions) {
		if reg[ipReg] == 28 {
			return reg[1]
		}
		instructions[reg[ipReg]].Apply(reg)
		reg[ipReg]++
	}

	return -1
}

func partTwo(ipReg int, instructions []OpCode) int {
	reg := make([]int, 6)
	visited := make(map[int]int)
	var prevValue int

	for reg[ipReg] >= 0 && reg[ipReg] < len(instructions) {
		if reg[ipReg] == 28 {
			visited[reg[1]]++
			if visited[reg[1]] == 2 {
				return prevValue
			}
			prevValue = reg[1]
		}
		instructions[reg[ipReg]].Apply(reg)
		reg[ipReg]++
	}
	
	return -1
}