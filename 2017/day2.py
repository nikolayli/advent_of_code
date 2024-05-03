from typing import List

def part_one(spreadsheet: List[List[int]]) -> int:
  sum = 0

  for row in spreadsheet:
    if not row:
      continue

    max_num = max(row)
    min_num = min(row)

    sum += max_num - min_num

    return sum

def part_two(spreadsheet: List[List[int]]) -> int:
  sum = 0

  for row in spreadsheet:
    for i in range(len(row)):
      for j in range(i+1, len(row)):
        if row[i] % row[j] == 0:
          sum += row[i] // row[j]
        elif row[j] % row[i] == 0:
          sum += row[j] // row[i]

  return sum

def main():
  with open('input.txt', 'r') as file:
    spreadsheet = []
    for line in file:
      row = [int(num) for num in line.split()]
      spreadsheet.append(row)

    checksum = part_one(spreadsheet)
    result = part_two(spreadsheet)

    print("Checksum for the spreadsheet:", checksum)
    print("Sum of each row's result:", result)

if __name__ == '__main__':
  main()