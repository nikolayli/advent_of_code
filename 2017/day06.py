from typing import List, Tuple

def read_input(file_path: str) -> List[int]:
    with open(file_path, 'r') as file:
        return list(map(int, file.readline().strip().split()))

def redistribute(memory_banks: List[int]) -> Tuple[int, int]:
    seen_configs = {}
    cycles = 0 
    
    while tuple(memory_banks) not in seen_configs:
        seen_configs[tuple(memory_banks)] = cycles 
        cycles += 1 
        max_blocks = max(memory_banks)
        index = memory_banks.index(max_blocks)
        memory_banks[index] = 0 
        
        while max_blocks > 0:
            index = (index + 1) % len(memory_banks)
            memory_banks[index] += 1 
            max_blocks -= 1

    first_seen_cycle = seen_configs[tuple(memory_banks)]
    loop_size = cycles - first_seen_cycle 
    
    return cycles, loop_size

def main() -> None:
    memory_banks = read_input('input.txt')
    cycles, loop_size = redistribute(memory_banks)
    print(
        f'Number of redistribution cycles before a configuration is repeated: 
        {cycles}'
    )
    print(f'Size of the loop: {loop_size}')

if __name__ == '__main__':
    main()