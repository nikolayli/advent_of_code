#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <algorithm>

class IWasToldThereWouldBeNoMath {
public:
    int partOne(const std::vector<int>& dimensions) {
        int sumWrappingPaper = 0;

        for (int i = 0; i + 2 < dimensions.size(); i += 3) {
            const int sideOne = dimensions[i] * dimensions[i + 1];
            const int sideTwo = dimensions[i + 1] * dimensions[i + 2];
            const int sideThree = dimensions[i + 2] * dimensions[i];
            const int smallestSide = std::min({ sideOne, sideTwo, sideThree });
            const int WrappingPaper = 2 * sideOne + 2 * sideTwo + 2 * sideThree + smallestSide;
            sumWrappingPaper += WrappingPaper;
        }

        return sumWrappingPaper;
    }

    int partTwo(std::vector<int>& dimensions) {
        int sumRibbon = 0;

        for (int i = 0; i + 2 < dimensions.size(); i += 3) {
            std::sort(dimensions.begin() + i, dimensions.begin() + i + 3);
            const int wrapRibbon = 2 * (dimensions[i] + dimensions[i + 1]);
            const int bowRibbon = dimensions[i] * dimensions[i + 1] * dimensions[i + 2];
            sumRibbon += wrapRibbon + bowRibbon;
        }

        return sumRibbon;
    }
};

int main() {
    std::ifstream inputFile("input.txt");
    std::vector<int> dimensions;

    if (inputFile.is_open()) {
        std::string line;
        while (std::getline(inputFile, line)) {
            std::istringstream iss(line);
            std::string token;
            while (std::getline(iss, token, 'x')) {
                int dimension = std::stoi(token);
                dimensions.push_back(dimension);
            }
        }
        inputFile.close();
    }
    else {
        std::cout << "Unable to open input.txt" << std::endl;
        return 1;
    }

    int sumWrappingPaper = IWasToldThereWouldBeNoMath().partOne(dimensions);
    std::cout << "Total number of square feet of wrapping paper they will order: "
        << sumWrappingPaper << std::endl;


    int sumRibbon = IWasToldThereWouldBeNoMath().partTwo(dimensions);
    std::cout << "Total feet of ribbon should they order: " << sumRibbon << std::endl;

    return 0;
}