def part_one(captcha: str) -> int:
  sum = 0
  length = len(captcha)

  for i in range(length):
    if captcha[i] == captcha[(i + 1) % length]:
      sum += int(captcha[i])

  return sum

def part_two(captcha: str) -> int:
  sum = 0
  length = len(captcha)

  for i in range(length):
    if captcha[i] == captcha[(i + length // 2) % length]:
      sum += int(captcha[i])

  return sum    

def main():
  with open('input.txt', 'r') as file:
    captcha = file.read()

  solve_captcha = part_one(captcha)
  solve_new_captcha = part_two(captcha)

  print("Solution to captcha: ", solve_captcha)
  print("Solution to new captcha: ", solve_new_captcha)

if __name__ == '__main__':
  main()