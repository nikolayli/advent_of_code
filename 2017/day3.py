def part_one(data: int) -> int:
  n = int((data ** 0.5 - 1) // 2) + 1
  x = y = n
  curr_data = (2 * n + 1) ** 2
  distance = curr_data - data

  if distance < 2 * n:
    x -= distance
  else:
    x -= 2 * n
    y -= distance - 2 * n

  return abs(x) + abs(y)

def part_two(data: int) -> int:
  grid_size = 100
  grid = [[0] * grid_size for _ in range(grid_size)]

  x = y = grid_size // 2
  grid[y][x] = 1
  directions = [(1, 0), (0, 1), (-1, 0), (0, -1)]

  direction_index = 0
  step_size = 1
  step_count = 0
  curr_data = 1

  while curr_data <= data:
    x += directions[direction_index][0]
    y += directions[direction_index][1]
    step_count += 1

    curr_data = sum(grid[y + dy][x + dx] for dx in [-1, 0, 1] for dy in [-1, 0, 1])
    grid[y][x] = curr_data

    if step_count == step_size:
      direction_index = (direction_index + 1) % 4
      if direction_index % 2 == 0:
        step_size += 1
      step_count = 0

    return curr_data

def main():
  data = 277678

  steps = part_one(data)
  first_larger_value = part_two(data)

  print("Steps are required to transfer data from the input to the access port: ", steps)
  print("First value greater than the input parameter: ", first_larger_value)

if __name__ == "__main__":
  main()