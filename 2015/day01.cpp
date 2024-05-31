#include <iostream>
#include <fstream>
#include <vector>
#include <string>

class NotQuiteLisp {
 public:
  int partOne(const std::vector<char>& instructions) {
    int floor = 0;
    
    for (const char c : instructions) {
      if (c == '(')
        ++floor;
      if (c == ')')
        --floor;
    }

    return floor;
  }

  int partTwo(const std::vector<char>& instructions) {
    int floor = 0;

    for (int i = 0; i < instructions.size(); ++i) {
      if (instructions[i] == '(')
        ++floor;
      if (instructions[i] == ')')
        --floor;
      if (floor == -1)
        return i + 1;
    }

    return -1;
  }
};

int main() {
  std::ifstream inputFile("input.txt");
  std::vector<char> instructions;

  if (inputFile.is_open()) {
    char c;
    while (inputFile.get(c))
      instructions.push_back(c);
    
    inputFile.close();
  } else {
    std::cout << "Unable to open input.txt" << std::endl;
    return 1;
  }

  NotQuiteLisp nql;

  int floor = nql.partOne(instructions);
  std::cout << "Floor required for Santa: " << floor << std::endl;

  int positionFirstBasement = nql.partTwo(instructions);
  if (positionFirstBasement != -1)
    std::cout << "Position of the character that causes Santa to first enter the basement: " 
              << positionFirstBasement << std::endl;
  else
    std::cout << "Santa never enters the basement." << std::endl;

  return 0;
}