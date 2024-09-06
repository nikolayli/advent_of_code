package main

import (
  "bufio"
  "fmt"
  "os"
  "sort"
)

type Direction int
type Turn int

type Coord struct {
  x, y int
}

type Cart struct {
  coord    Coord
  dir      Direction
  nextTurn Turn
  crashed  bool
}

const (
  Up Direction = iota
  Right
  Down
  Left
)

const (
  LeftTurn Turn = iota
  Straight
  RightTurn
)

func main() {
  tracks, carts := parseInput("input.txt")
  firstCrash := partOne(tracks, carts)
  fmt.Printf("The location of the first crash is: %d,%d\n", 
    firstCrash.x, firstCrash.y)

  carts = resetCarts(carts)
  lastCart := partTwo(tracks, carts)
  fmt.Printf("The location of the last cart is: %d,%d\n", 
    lastCart.x, lastCart.y)
}

func parseInput(filename string) ([][]rune, []*Cart) {
  file, err := os.Open(filename)
  if err != nil {
    panic(err)
  }
  defer file.Close()

  var tracks [][]rune
  var carts []*Cart

  scanner := bufio.NewScanner(file)
  y := 0
  for scanner.Scan() {
    line := scanner.Text()
    trackLine := make([]rune, len(line))
    for x, char := range line {
      var cart *Cart
      switch char {
      case '^':
        cart = &Cart{coord: Coord{x, y}, dir: Up}
        trackLine[x] = '|'
      case 'v':
        cart = &Cart{coord: Coord{x, y}, dir: Down}
        trackLine[x] = '|'
      case '<':
        cart = &Cart{coord: Coord{x, y}, dir: Left}
        trackLine[x] = '-'
      case '>':
        cart = &Cart{coord: Coord{x, y}, dir: Right}
        trackLine[x] = '-'
      default:
        trackLine[x] = char
      }
      if cart != nil {
        carts = append(carts, cart)
      }
    }
    tracks = append(tracks, trackLine)
    y++
  }

  return tracks, carts
}

func partOne(tracks [][]rune, carts []*Cart) Coord {
  for {
    sortCarts(carts)
    for _, cart := range carts {
      if cart.crashed {
        continue
      }
      cart.move()

      for _, other := range carts {
        if cart != other && !other.crashed && 
           cart.coord == other.coord {
          cart.crashed = true
          other.crashed = true
          return cart.coord
        }
      }

      track := tracks[cart.coord.y][cart.coord.x]
      cart.turn(track)
    }
  }
}

func partTwo(tracks [][]rune, carts []*Cart) Coord {
  for {
    sortCarts(carts)
    activeCarts := 0
    var lastCart *Cart
    for _, cart := range carts {
      if cart.crashed {
        continue
      }
      cart.move()

      for _, other := range carts {
        if cart != other && !other.crashed && 
           cart.coord == other.coord {
          cart.crashed = true
          other.crashed = true
        }
      }

      if !cart.crashed {
        activeCarts++
        lastCart = cart
      }

      track := tracks[cart.coord.y][cart.coord.x]
      cart.turn(track)
    }
    if activeCarts == 1 {
      return lastCart.coord
    }
  }
}

func sortCarts(carts []*Cart) {
  sort.Slice(carts, func(i, j int) bool {
    if carts[i].coord.y == carts[j].coord.y {
      return carts[i].coord.x < carts[j].coord.x
    }
    return carts[i].coord.y < carts[j].coord.y
  })
}

func (c *Cart) move() {
  switch c.dir {
  case Up:
    c.coord.y--
  case Down:
    c.coord.y++
  case Left:
    c.coord.x--
  case Right:
    c.coord.x++
  }
}

func (c *Cart) turn(track rune) {
  switch track {
  case '/':
    if c.dir == Up || c.dir == Down {
      c.dir = (c.dir + 1) % 4
    } else {
      c.dir = (c.dir + 3) % 4
    }
  case '\\':
    if c.dir == Up || c.dir == Down {
      c.dir = (c.dir + 3) % 4
    } else {
      c.dir = (c.dir + 1) % 4
    }
  case '+':
    switch c.nextTurn {
    case LeftTurn:
      c.dir = (c.dir + 3) % 4
    case RightTurn:
      c.dir = (c.dir + 1) % 4
    }
    c.nextTurn = (c.nextTurn + 1) % 3
  }
}

func resetCarts(originalCarts []*Cart) []*Cart {
  carts := make([]*Cart, len(originalCarts))
  for i, cart := range originalCarts {
    carts[i] = &Cart{
      coord:    cart.coord,
      dir:      cart.dir,
      nextTurn: cart.nextTurn,
      crashed:  false,
    }
  }
  return carts
}