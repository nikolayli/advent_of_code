package main

import (
  "bufio"
  "fmt"
  "os"
  "strconv"
  "strings"
)

type Claim struct {
  id     int
  left   int
  top    int
  width  int
  height int
}

func main() {
  claims, err := readClaims("input.txt")
  if err != nil {
    fmt.Println("Error reading claims: ", err)
    return
  }

  fabricSize := getMaxFabricSize(claims)
  fabric := createFabric(fabricSize)

  overlapCount := countOverlaps(claims, fabric)
  nonOverlappingClaimID := findNonOverlappingClaim(claims, fabric)

  fmt.Println("Number of square inches within two or more claims: ", 
    overlapCount)
  fmt.Println("ID of the only claim that doesn't overlap: ", 
    nonOverlappingClaimID)
}

func parseClaim(line string) Claim {
  parts := strings.Split(line, " ")
  id, _ := strconv.Atoi(parts[0][1:])
  coords := strings.Split(parts[2][:len(parts[2])-1], ",")
  left, _ := strconv.Atoi(coords[0])
  top, _ := strconv.Atoi(coords[1])
  dims := strings.Split(parts[3], "x")
  width, _ := strconv.Atoi(dims[0])
  height, _ := strconv.Atoi(dims[1])

  return Claim{id, left, top, width, height}
}

func readClaims(filename string) ([]Claim, error) {
  file, err := os.Open(filename)
  if err != nil {
    return nil, err
  }
  defer file.Close()

  var claims []Claim
  scanner := bufio.NewScanner(file)
  for scanner.Scan() {
    line := scanner.Text()
    claim := parseClaim(line)
    claims = append(claims, claim)
  }

  if err := scanner.Err(); err != nil {
    return nil, err
  }

  return claims, nil
}

func getMaxFabricSize(claims []Claim) int {
  maxSize := 0
  for _, claim := range claims {
    if claim.left+claim.width > maxSize {
      maxSize = claim.left + claim.width
    }
    if claim.top+claim.height > maxSize {
      maxSize = claim.top + claim.height
    }
  }
  return maxSize
}

func createFabric(size int) [][]int {
  fabric := make([][]int, size)
  for i := range fabric {
    fabric[i] = make([]int, size)
  }
  return fabric
}

func markFabric(claims []Claim, fabric [][]int) {
  for _, claim := range claims {
    for i := claim.left; i < claim.left+claim.width; i++ {
      for j := claim.top; j < claim.top+claim.height; j++ {
        fabric[i][j]++
      }
    }
  }
}

func countOverlaps(claims []Claim, fabric [][]int) int {
  markFabric(claims, fabric)
  overlapCount := 0
  for i := range fabric {
    for j := range fabric[i] {
      if fabric[i][j] > 1 {
        overlapCount++
      }
    }
  }
  return overlapCount
}

func findNonOverlappingClaim(claims []Claim, fabric [][]int) int {
  for _, claim := range claims {
    overlap := false
    for i := claim.left; i < claim.left+claim.width; i++ {
      for j := claim.top; j < claim.top+claim.height; j++ {
        if fabric[i][j] > 1 {
          overlap = true
          break
        }
      }
      if overlap {
        break
      }
    }
    if !overlap {
      return claim.id
    }
  }
  return -1
}