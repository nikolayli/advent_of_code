package main

import (
  "fmt"
  "os"
  "regexp"
  "strconv"
  "strings"
)

func main() {
  points := parseInput("input.txt")
  seconds := findMessageTime(points)
  fmt.Println("Message appears in the sky:")
  printPoints(points)
  fmt.Printf("Seconds to wait for the message: %d\n", seconds)
}

func parseInput(filename string) [][]int {
  data, err := os.ReadFile(filename)
  if err != nil {
    fmt.Println("Error opening file:", err)
    return nil
  }

  lines := strings.Split(string(data), "\n")
  points := [][]int{}
  re := regexp.MustCompile(
    `position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>`,
  )

  for _, line := range lines {
    if len(line) == 0 {
      continue
    }
    matches := re.FindStringSubmatch(line)
    if matches != nil {
      x, _ := strconv.Atoi(matches[1])
      y, _ := strconv.Atoi(matches[2])
      vx, _ := strconv.Atoi(matches[3])
      vy, _ := strconv.Atoi(matches[4])
      points = append(points, []int{x, y, vx, vy})
    }
  }

  return points
}

func calculateBoxSize(points [][]int) int {
  minX, maxX := points[0][0], points[0][0]
  minY, maxY := points[0][1], points[0][1]

  for _, p := range points {
    if p[0] < minX {
      minX = p[0]
    }
    if p[0] > maxX {
      maxX = p[0]
    }
    if p[1] < minY {
      minY = p[1]
    }
    if p[1] > maxY {
      maxY = p[1]
    }
  }

  return (maxX - minX) + (maxY - minY)
}

func findMessageTime(points [][]int) int {
  seconds := 0
  boxSize := calculateBoxSize(points)

  for {
    seconds++
    for i := range points {
      points[i][0] += points[i][2]
      points[i][1] += points[i][3]
    }

    newBoxSize := calculateBoxSize(points)
    if newBoxSize > boxSize {
      break
    }
    boxSize = newBoxSize
  }

  for i := range points {
    points[i][0] -= points[i][2]
    points[i][1] -= points[i][3]
  }
  seconds--

  return seconds
}

func printPoints(points [][]int) {
  minX, maxX := points[0][0], points[0][0]
  minY, maxY := points[0][1], points[0][1]

  for _, p := range points {
    if p[0] < minX {
      minX = p[0]
    }
    if p[0] > maxX {
      maxX = p[0]
    }
    if p[1] < minY {
      minY = p[1]
    }
    if p[1] > maxY {
      maxY = p[1]
    }
  }

  grid := make([][]rune, maxY-minY+1)
  for i := range grid {
    grid[i] = make([]rune, maxX-minX+1)
    for j := range grid[i] {
      grid[i][j] = '.'
    }
  }

  for _, p := range points {
    grid[p[1]-minY][p[0]-minX] = '#'
  }

  for _, row := range grid {
    fmt.Println(string(row))
  }
}