def read_input(file_path):
    with open(file_path, 'r') as file:
        return [int(line.strip()) for line in file if line.strip()]

def find_exit_steps(jump_offsets, part_two=False):
    steps = 0
    position = 0
    offsets = jump_offsets[:]

    while 0 <= position < len(offsets):
        jump = offsets[position]
        if part_two and jump >= 3:
            offsets[position] -= 1
        else:
            offsets[position] += 1
        position += jump
        steps += 1

    return steps

def main():
    jump_offsets = read_input('input.txt')

    steps_part_one = find_exit_steps(jump_offsets)
    print(f"Part One: Number of steps to reach the exit: {steps_part_one}")

    steps_part_two = find_exit_steps(jump_offsets, part_two=True)
    print(f"Part Two: Number of steps to reach the exit: {steps_part_two}")

if __name__ == "__main__":
    main()