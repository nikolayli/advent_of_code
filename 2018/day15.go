package main

import (
	"bufio"
	"errors"
	"fmt"
	"math"
	"os"
	"sort"
)

const (
	startingHealth      = 200
	baseAttackPower     = 3
	noTargetFoundError  = "no target found"
	malformedInputError = "malformed input"
	targetChar          = 'x'
	wallChar            = '#'
	openChar            = '.'
	elfChar             = 'E'
	goblinChar          = 'G'
)

const (
	noWinner winner = iota
	elfWinner
	goblinWinner
)

type board [][]node
type nodeQueue []node
type winner int
type nodeList []node

type coordinate struct {
	row int
	col int
}

type node interface {
	setPos(coordinate)
	getPos() coordinate
	canTravelThrough() bool
}

type tile struct {
	position coordinate
	isWall   bool
}

type entity struct {
	position    coordinate
	attackPower int
	health      int
	isGoblin    bool
}

func main() {
	rawBoard, err := readInput("input.txt")
	if err != nil {
		fmt.Println("Error reading input:", err)
		return
	}

	parsedBoard, entities, err := parseInput(rawBoard)
	if err != nil {
		fmt.Println("Error parsing input:", err)
		return
	}

	outcome1 := partOne(parsedBoard, entities)
	fmt.Println("Part One outcome of the combat:", outcome1)

	parsedBoard, _, err = parseInput(rawBoard)
	if err != nil {
		fmt.Println("Error parsing input:", err)
		return
	}

	outcome2 := partTwo(parsedBoard)
	fmt.Println("Part Two outcome of the combat:", outcome2)
}

func readInput(filename string) ([]string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, fmt.Errorf("error opening input file: %w", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var rawBoard []string
	for scanner.Scan() {
		rawBoard = append(rawBoard, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("error reading input file: %w", err)
	}

	return rawBoard, nil
}

func parseInput(rawBoard []string) (board, nodeList, error) {
	parsedBoard := make(board, len(rawBoard))
	entities := nodeList{}

	for row := range parsedBoard {
		parsedBoard[row] = make([]node, len(rawBoard[row]))
		for col, char := range rawBoard[row] {
			pos := coordinate{row, col}
			switch char {
			case wallChar, openChar:
				parsedBoard[row][col] = &tile{
					position: pos,
					isWall:   char == wallChar,
				}
			case elfChar, goblinChar:
				parsedBoard[row][col] = &entity{
					position:    pos,
					attackPower: baseAttackPower,
					health:      startingHealth,
					isGoblin:    char == goblinChar,
				}
				entities = append(entities, parsedBoard[row][col])
			default:
				return nil, nil, errors.New(malformedInputError)
			}
		}
	}

	return parsedBoard, entities, nil
}

func partOne(b board, entities nodeList) int {
	_, outcome := runSimulation(b, entities)
	return outcome
}

func partTwo(b board) int {
	allElvesAlive := false
	elfAttackPower := baseAttackPower
	lastOutcome := -1

	for !allElvesAlive {
		elfAttackPower++
		roundBoard, roundEntities := b.clone()
		for i := range roundEntities {
			if entityNode, isEntity := roundEntities[i].(*entity); 
				 isEntity && !entityNode.isGoblin {
				entityNode.attackPower = elfAttackPower
			}
		}

		var lastWinner winner
		lastWinner, lastOutcome = runSimulation(roundBoard, roundEntities)
		if lastWinner != elfWinner {
			continue
		}

		allElvesAlive = !didElfDie(roundEntities)
	}

	return lastOutcome
}

func runSimulation(b board, entities nodeList) (winner, int) {
	roundCount := 0
	roundWinner := noWinner

	for roundWinner == noWinner {
		sort.Sort(entities)
		finishedRoundEarly := false

		for _, e := range entities {
			entityNode := e.(*entity)
			if entityNode.health <= 0 {
				continue
			}
			if !entityNode.attack(b) {
				entityNode.move(b)
				entityNode.attack(b)
				roundWinner = b.getWinner()
				if roundWinner != noWinner {
					finishedRoundEarly = true
					break
				}
			}
		}

		if !finishedRoundEarly {
			roundCount++
		}
	}

	healthTotal := 0
	for _, e := range entities {
		entityNode := e.(*entity)
		if entityNode.health > 0 {
			healthTotal += entityNode.health
		}
	}

	return roundWinner, roundCount * healthTotal
}

func (b board) clone() (board, nodeList) {
	entities := nodeList{}
	newBoard := make(board, len(b))

	for row, boardRow := range b {
		newBoard[row] = make([]node, len(boardRow))
		for col, boardNode := range boardRow {
			boardNode.setPos(coordinate{row, col})
			if entityNode, isEntity := boardNode.(*entity); isEntity {
				copiedEntity := *entityNode
				newBoard[row][col] = &copiedEntity
				entities = append(entities, newBoard[row][col])
			} else {
				newBoard[row][col] = boardNode
			}
		}
	}

	return newBoard, entities
}

func didElfDie(entities nodeList) bool {
	for _, rawEntity := range entities {
		entityNode := rawEntity.(*entity)
		if entityNode.health <= 0 && !entityNode.isGoblin {
			return true
		}
	}

	return false
}

func (e *entity) attack(b board) bool {
	lowestHealthTarget := &entity{health: math.MaxInt32}
	neighbors := b.getNeighbors(e.getPos())
	sort.Sort(neighbors)

	for _, neighbor := range neighbors {
		if entityNode, isEntity := neighbor.(*entity); 
			 isEntity && entityNode.isGoblin != e.isGoblin {
			if entityNode.health < lowestHealthTarget.health {
				lowestHealthTarget = entityNode
			}
		}
	}

	if lowestHealthTarget.health == math.MaxInt32 {
		return false
	}

	lowestHealthTarget.health -= e.attackPower
	if lowestHealthTarget.health <= 0 {
		entityPos := lowestHealthTarget.getPos()
		b[entityPos.row][entityPos.col] = &tile{
			position: entityPos,
			isWall:   false,
		}
	}

	return true
}

func (e *entity) move(b board) {
	toVisit := nodeQueue{e}
	targetCandidates := nodeList{}
	distanceTable := make(map[node]int)
	distance := 0
	searchUntilDistance := -1
	distanceTable[e] = 0

	for len(toVisit) > 0 && distance != searchUntilDistance {
		visitingNode := toVisit.dequeue()
		neighbors := b.getNeighbors(visitingNode.getPos())
		distance = distanceTable[visitingNode] + 1

		for _, neighbor := range neighbors {
			if _, wasVisited := distanceTable[neighbor]; !wasVisited {
				if entityNode, isEntity := neighbor.(*entity); 
					 isEntity && entityNode.isGoblin != e.isGoblin {
					toVisit.enqueue(neighbor)
					distanceTable[neighbor] = distance
					if visitingNode.canTravelThrough() {
						targetCandidates = append(targetCandidates, visitingNode)
						searchUntilDistance = distance + 1
					}
				} else if neighbor.canTravelThrough() {
					toVisit.enqueue(neighbor)
					distanceTable[neighbor] = distance
				}
			}
		}
	}

	if len(targetCandidates) == 0 {
		return
	}

	target := getBestTarget(targetCandidates, distanceTable)
	moveNode := getNextMove(b, target, distanceTable)
	newPos := moveNode.getPos()
	oldPos := e.position
	e.setPos(newPos)
	moveNode.setPos(oldPos)
	b[oldPos.row][oldPos.col] = moveNode
	b[newPos.row][newPos.col] = e
}

func (b board) getWinner() winner {
	currentWinner := noWinner
	for row := range b {
		for _, memberNode := range b[row] {
			if entityNode, isEntity := memberNode.(*entity); isEntity {
				if currentWinner == goblinWinner && !entityNode.isGoblin {
					return noWinner
				} else if currentWinner == elfWinner && entityNode.isGoblin {
					return noWinner
				} else if currentWinner == noWinner && entityNode.isGoblin {
					currentWinner = goblinWinner
				} else if currentWinner == noWinner && !entityNode.isGoblin {
					currentWinner = elfWinner
				}
			}
		}
	}

	return currentWinner
}

func (b board) getNeighbors(pos coordinate) nodeList {
	neighbors := make(nodeList, 0, 4)
	for dRow := -1; dRow <= 1; dRow++ {
		for dCol := -1; dCol <= 1; dCol++ {
			if dRow == dCol || -dRow == dCol {
				continue
			}

			row := pos.row + dRow
			col := pos.col + dCol
			if row >= 0 && row < len(b) && col >= 0 && col < len(b[row]) {
				neighbors = append(neighbors, b[row][col])
			}
		}
	}

	return neighbors
}

func (t *tile) getPos() coordinate {
	return t.position
}

func (q *nodeQueue) dequeue() node {
	head := (*q)[0]
	*q = (*q)[1:]
	return head
}

func (q *nodeQueue) enqueue(newNode node) {
	*q = append(*q, newNode)
}

func getBestTarget(
	targetCandidates nodeList, distanceTable map[node]int,
) node {
	sort.Sort(targetCandidates)
	lowestDistance := math.MaxInt32
	var bestNode node

	for _, target := range targetCandidates {
		if distance := distanceTable[target]; distance < lowestDistance {
			lowestDistance = distance
			bestNode = target
		}
	}

	return bestNode
}

func getNextMove(b board, target node, distanceTable map[node]int) node {
	possiblePaths := getPathsToTarget(b, target, distanceTable)
	pathStarts := nodeList{}

	for _, path := range possiblePaths {
		if len(path) > 0 {
			pathStarts = append(pathStarts, path[0])
		}
	}

	if len(pathStarts) > 0 {
		sort.Sort(pathStarts)
		return pathStarts[0]
	}

	return target
}

func getPathsToTarget(
	b board, target node, distanceTable map[node]int,
) []nodeList {
	if distanceTable[target] == 0 {
		return []nodeList{}
	}

	pathStarts := nodeList{}
	targetNeighbors := b.getNeighbors(target.getPos())

	for _, neighbor := range targetNeighbors {
		if distance, ok := distanceTable[neighbor]; 
			 ok && distance == distanceTable[target]-1 {
			pathStarts = append(pathStarts, neighbor)
		}
	}

	sort.Sort(pathStarts)
	paths := []nodeList{}

	for _, pathStart := range pathStarts {
		possiblePaths := getPathsToTarget(b, pathStart, distanceTable)
		if len(possiblePaths) == 0 {
			paths = append(paths, nodeList{})
			continue
		}
		for _, possiblePath := range possiblePaths {
			path := append(possiblePath, pathStart)
			paths = append(paths, path)
		}
	}

	return paths
}

func (e *entity) setPos(newPos coordinate) {
	e.position = newPos
}

func (e *entity) getPos() coordinate {
	return e.position
}

func (t *tile) canTravelThrough() bool {
	return !t.isWall
}

func (t *tile) setPos(newPos coordinate) {
	t.position = newPos
}

func (e *entity) canTravelThrough() bool {
	return false
}

func (list nodeList) Len() int {
	return len(list)
}

func (list nodeList) Less(i, j int) bool {
	iPos := list[i].getPos()
	jPos := list[j].getPos()
	if iPos.row == jPos.row {
		return iPos.col < jPos.col
	}
	return iPos.row < jPos.row
}

func (list nodeList) Swap(i, j int) {
	list[i], list[j] = list[j], list[i]
}