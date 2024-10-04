package main

import (
	"bufio"
	"fmt"
	"os"
	"reflect"
	"strings"
)

type registers []int

type operation struct {
	opcode         int
	inputA, inputB int
	output         int
}

type sample struct {
	before    registers
	operation operation
	after     registers
}

type instruction func(o operation) func(r registers) registers

func main() {
	data, err := readFile("input.txt")
	if err != nil {
		panic(err)
	}

	samples, operations, err := parseFile(data)
	if err != nil {
		panic(err)
	}

	count := countThreeOpCodes(samples)
	fmt.Printf("Samples behaving like three opcodes: %d\n", count)

	codes := opcodes(samples)
	result := runProgram(codes, operations)
	fmt.Printf(
		"Value contained in the registry is 0 after running the test program: %d\n", 
		result[0],
	)
}

func readFile(filename string) (string, error) {
	f, err := os.Open(filename)
	if err != nil {
		return "", err
	}
	defer f.Close()

	var data string
	s := bufio.NewScanner(f)
	for s.Scan() {
		data += s.Text() + "\n"
	}

	if s.Err() != nil {
		return "", s.Err()
	}

	return data, nil
}

func parseFile(content string) ([]sample, []operation, error) {
	lines := strings.Split(strings.TrimSpace(content), "\n")
	var samples []sample
	var operations []operation
	var curi *sample

	for _, line := range lines {
		if len(line) == 0 {
			continue
		}
		if strings.HasPrefix(line, "Before") {
			r := make([]int, 4)
			fmt.Sscanf(line, "Before: [%d, %d, %d, %d]", &r[0], &r[1], &r[2], &r[3])
			curi = &sample{
				before: r,
			}
			continue
		} else if strings.HasPrefix(line, "After") {
			r := make([]int, 4)
			fmt.Sscanf(line, "After: [%d, %d, %d, %d]", &r[0], &r[1], &r[2], &r[3])
			curi.after = r
			samples = append(samples, *curi)
			curi = nil
			continue
		}
		var op operation
		fmt.Sscanf(
			line, "%d %d %d %d", &op.opcode, &op.inputA, &op.inputB, &op.output,
		)
		if curi != nil {
			curi.operation = op
		} else {
			operations = append(operations, op)
		}
	}

	return samples, operations, nil
}

func runProgram(
	instructionSet map[int]instruction, operations []operation,
) registers {
	r := make([]int, 4)
	for _, o := range operations {
		r = instructionSet[o.opcode](o)(r)
	}

	return r
}

func countThreeOpCodes(samples []sample) int {
	count := 0
	instructions := []instruction{
		addr, addi,
		mulr, muli,
		banr, bani,
		borr, bori,
		setr, seti,
		gtir, gtrr, gtri,
		eqri, eqrr, eqir,
	}

	for _, s := range samples {
		c := 0
		for _, i := range instructions {
			before := make([]int, 4)
			copy(before, s.before)
			got := i(s.operation)(before)
			if reflect.DeepEqual(got, s.after) {
				c++
			}
		}
		if c >= 3 {
			count++
		}
	}

	return count
}

func opcodes(samples []sample) map[int]instruction {
	res := make(map[int]instruction)
	instructions := []instruction{
		addr, addi,
		mulr, muli,
		banr, bani,
		borr, bori,
		setr, seti,
		gtir, gtrr, gtri,
		eqri, eqrr, eqir,
	}
	for len(instructions) > 0 {
		for _, s := range samples {
			count := 0
			var ins instruction
			var pos int
			for curPos, curIns := range instructions {
				before := make([]int, 4)
				copy(before, s.before)
				got := curIns(s.operation)(before)
				if reflect.DeepEqual(got, s.after) {
					count++
					ins = curIns
					pos = curPos
				}
			}
			if count == 1 {
				res[s.operation.opcode] = ins
				instructions = append(instructions[:pos], instructions[pos+1:]...)
			}
		}
	}
	
	return res
}

func addr(o operation) func(r registers) registers {
	return func(r registers) registers {
		r[o.output] = r[o.inputA] + r[o.inputB]
		return r
	}
}

func addi(o operation) func(r registers) registers {
	return func(r registers) registers {
		r[o.output] = r[o.inputA] + o.inputB
		return r
	}
}

func mulr(o operation) func(r registers) registers {
	return func(r registers) registers {
		r[o.output] = r[o.inputA] * r[o.inputB]
		return r
	}
}

func muli(o operation) func(r registers) registers {
	return func(r registers) registers {
		r[o.output] = r[o.inputA] * o.inputB
		return r
	}
}

func banr(o operation) func(r registers) registers {
	return func(r registers) registers {
		r[o.output] = r[o.inputA] & r[o.inputB]
		return r
	}
}

func bani(o operation) func(r registers) registers {
	return func(r registers) registers {
		r[o.output] = r[o.inputA] & o.inputB
		return r
	}
}

func borr(o operation) func(r registers) registers {
	return func(r registers) registers {
		r[o.output] = r[o.inputA] | r[o.inputB]
		return r
	}
}

func bori(o operation) func(r registers) registers {
	return func(r registers) registers {
		r[o.output] = r[o.inputA] | o.inputB
		return r
	}
}

func setr(o operation) func(r registers) registers {
	return func(r registers) registers {
		r[o.output] = r[o.inputA]
		return r
	}
}

func seti(o operation) func(r registers) registers {
	return func(r registers) registers {
		r[o.output] = o.inputA
		return r
	}
}

func gtir(o operation) func(r registers) registers {
	return func(r registers) registers {
		if o.inputA > r[o.inputB] {
			r[o.output] = 1
		} else {
			r[o.output] = 0
		}
		return r
	}
}

func gtri(o operation) func(r registers) registers {
	return func(r registers) registers {
		if r[o.inputA] > o.inputB {
			r[o.output] = 1
		} else {
			r[o.output] = 0
		}
		return r
	}
}

func gtrr(o operation) func(r registers) registers {
	return func(r registers) registers {
		if r[o.inputA] > r[o.inputB] {
			r[o.output] = 1
		} else {
			r[o.output] = 0
		}
		return r
	}
}

func eqir(o operation) func(r registers) registers {
	return func(r registers) registers {
		if o.inputA == r[o.inputB] {
			r[o.output] = 1
		} else {
			r[o.output] = 0
		}
		return r
	}
}

func eqri(o operation) func(r registers) registers {
	return func(r registers) registers {
		if r[o.inputA] == o.inputB {
			r[o.output] = 1
		} else {
			r[o.output] = 0
		}
		return r
	}
}

func eqrr(o operation) func(r registers) registers {
	return func(r registers) registers {
		if r[o.inputA] == r[o.inputB] {
			r[o.output] = 1
		} else {
			r[o.output] = 0
		}
		return r
	}
}