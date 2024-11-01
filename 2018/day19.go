package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Instruction struct {
	opcode  string
	a, b, c int
}

var operations = map[string]func([]int, int, int, int) {
	"addr": func(reg []int, a, b, c int) {
		reg[c] = reg[a] + reg[b]
	},
	"addi": func(reg []int, a, b, c int) {
		reg[c] = reg[a] + b
	},
	"mulr": func(reg []int, a, b, c int) {
		reg[c] = reg[a] * reg[b]
	},
	"muli": func(reg []int, a, b, c int) {
		reg[c] = reg[a] * b
	},
	"banr": func(reg []int, a, b, c int) {
		reg[c] = reg[a] & reg[b]
	},
	"bani": func(reg []int, a, b, c int) {
		reg[c] = reg[a] & b
	},
	"borr": func(reg []int, a, b, c int) {
		reg[c] = reg[a] | reg[b]
	},
	"bori": func(reg []int, a, b, c int) {
		reg[c] = reg[a] | b
	},
	"setr": func(reg []int, a, b, c int) {
		reg[c] = reg[a]
	},
	"seti": func(reg []int, a, b, c int) {
		reg[c] = a
	},
	"gtir": func(reg []int, a, b, c int) {
		if a > reg[b] { reg[c] = 1 } else { reg[c] = 0 }
	},
	"gtri": func(reg []int, a, b, c int) {
		if reg[a] > b { reg[c] = 1 } else { reg[c] = 0 }
	},
	"gtrr": func(reg []int, a, b, c int) {
		if reg[a] > reg[b] { reg[c] = 1 } else { reg[c] = 0 }
	},
	"eqir": func(reg []int, a, b, c int) {
		if a == reg[b] { reg[c] = 1 } else { reg[c] = 0 }
	},
	"eqri": func(reg []int, a, b, c int) {
		if reg[a] == b { reg[c] = 1 } else { reg[c] = 0 }
	},
	"eqrr": func(reg []int, a, b, c int) {
		if reg[a] == reg[b] { reg[c] = 1 } else { reg[c] = 0 }
	},
}

func main() {
	ipRegister, instructions, err := readInput("input.txt")
	if err != nil {
		fmt.Println("Error reading file: ", err)
		return
	}

	resultPartOne := runProgram(ipRegister, instructions, 0)
	fmt.Println("Part One - Value in register 0:", resultPartOne)

	resultPartTwo := runProgram(ipRegister, instructions, 1)
	fmt.Println("Part Two - Value in register 0:", resultPartTwo)
}

func readInput(filename string) (int, []Instruction, error) {
	file, err := os.Open(filename)
	if err != nil {
		return 0, nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	scanner.Scan()
	ipLine := scanner.Text()
	ipRegister, err := strconv.Atoi(strings.Split(ipLine, " ")[1])
	if err != nil {
		return 0, nil, err
	}

	var instructions []Instruction
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			continue
		}
		parts := strings.Split(line, " ")
		a, _ := strconv.Atoi(parts[1])
		b, _ := strconv.Atoi(parts[2])
		c, _ := strconv.Atoi(parts[3])
		instructions = append(instructions, Instruction{
			parts[0], a, b, c,
		})
	}

	if err := scanner.Err(); err != nil {
		return 0, nil, err
	}

	return ipRegister, instructions, nil
}

func runProgram(
	ipRegister int, instructions []Instruction, initialReg0 int,
) int {
	registers := make([]int, 6)
	registers[0] = initialReg0
	nStep := 0
	ip := 0

	for ip < len(instructions) && nStep < 20 {
		registers[ipRegister] = ip
		inst := instructions[ip]
		operations[inst.opcode](registers, inst.a, inst.b, inst.c)
		ip = registers[ipRegister]
		ip++
		nStep++ 
	}

	return sumDivisors(registers[4])
}

func sumDivisors(n int) int {
	sum := 0
	for i := 1; i <= n; i++ {
		if n%i == 0 {
			sum += i
		}
	}
	
	return sum
}