#include <iostream>
#include <fstream>
#include <string>
#include <unordered_set>

class PerfectlySphericalHousesinaVacuum {
public:
    int partOne(const std::string& directions) {
        int x = 0, y = 0;
        std::unordered_set<std::string> visitedHouses;
        visitedHouses.insert("0,0");

        for (char direction : directions) {
            switch (direction) {
            case '^': y++; break;
            case 'v': y--; break;
            case '>': x++; break;
            case '<': x--; break;
            }
            visitedHouses.insert(std::to_string(x) + "," + std::to_string(y));
        }

        return visitedHouses.size();
    }

    int partTwo(const std::string& directions) {
        int santa_x = 0, santa_y = 0;
        int robo_x = 0, robo_y = 0;
        std::unordered_set<std::string> visitedHouses;
        visitedHouses.insert("0,0");

        for (size_t i = 0; i < directions.length(); ++i) {
            int& x = (i % 2 == 0) ? santa_x : robo_x;
            int& y = (i % 2 == 0) ? santa_y : robo_y;

            switch (directions[i]) {
            case '^': y++; break;
            case 'v': y--; break;
            case '>': x++; break;
            case '<': x--; break;
            }
            visitedHouses.insert(std::to_string(x) + "," + std::to_string(y));
        }

        return visitedHouses.size();
    }
};

int main() {
    std::ifstream inputFile("input.txt");
    if (!inputFile.is_open()) {
        std::cout << "Unable to open input.txt" << std::endl;
        return 1;
    }

    std::string directions((std::istreambuf_iterator<char>(inputFile)), std::istreambuf_iterator<char>());
    inputFile.close();

    PerfectlySphericalHousesinaVacuum pshv;
    int presentHouses = pshv.partOne(directions);
    std::cout << "Number of houses with at least one present: " << presentHouses << std::endl;

    int presentHouses2 = pshv.partTwo(directions);
    std::cout << "Number of houses with at least one present next year: " << presentHouses2 << std::endl;

    return 0;
}