package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

type Record struct {
	timestamp time.Time
	message   string
}

type GuardSleep struct {
	totalMinutes int
	minutes      [60]int
}

func main() {
	file, err := os.Open("input.txt")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	var records []Record
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		timestamp, message := parseLine(line)
		records = append(records, Record{timestamp, message})
	}

	if err := scanner.Err(); err != nil {
		panic(err)
	}

	sort.Slice(records, func(i, j int) bool {
		return records[i].timestamp.Before(records[j].timestamp)
	})

	guardSleepData := processRecords(records)

	sleepiestGuard, sleepiestMinute := partOne(guardSleepData)
	resultPartOne := sleepiestGuard * sleepiestMinute
	fmt.Printf("Part One - Guard ID: %d, Minute: %d, Result: %d\n",
    sleepiestGuard, sleepiestMinute, resultPartOne)

	frequentGuard, frequentMinute := partTwo(guardSleepData)
	resultPartTwo := frequentGuard * frequentMinute
	fmt.Printf("Part Two - Guard ID: %d, Minute: %d, Result: %d\n",
    frequentGuard, frequentMinute, resultPartTwo)	
}

func parseLine(line string) (time.Time, string) {
	re := regexp.MustCompile(`\[(.*)\] (.*)`)
	matches := re.FindStringSubmatch(line)
	timestamp, err := time.Parse("2006-01-02 15:04", matches[1])
	if err != nil {
		panic(err)
	}

	return timestamp, matches[2]
}

func parseGuardID(message string) int {
	re := regexp.MustCompile(`#(\d+)`)
	matches := re.FindStringSubmatch(message)
	guardID, err := strconv.Atoi(matches[1])
	if err != nil {
		panic(err)
	}

	return guardID
}

func processRecords(records []Record) map[int]*GuardSleep {
	guardSleepData := make(map[int]*GuardSleep)
	var currentGuard int
	var sleepStart time.Time

	for _, record := range records {
		if strings.Contains(record.message, "Guard") {
			currentGuard = parseGuardID(record.message)
			if _, exists := guardSleepData[currentGuard]; !exists {
				guardSleepData[currentGuard] = &GuardSleep{}
			}
		} else if strings.Contains(record.message, "falls asleep") {
			sleepStart = record.timestamp
		} else if strings.Contains(record.message, "wakes up") {
			sleepEnd := record.timestamp
			sleepDuration := int(sleepEnd.Sub(sleepStart).Minutes())
			guardSleepData[currentGuard].totalMinutes += sleepDuration
			for i := sleepStart.Minute(); i < sleepEnd.Minute(); i++ {
				guardSleepData[currentGuard].minutes[i]++
			}
		}
	}

	return guardSleepData
}

func partOne(guardSleepData map[int]*GuardSleep) (int, int) {
	var sleepiestGuard int
	maxSleep := 0

	for guard, data := range guardSleepData {
		if data.totalMinutes > maxSleep {
			maxSleep = data.totalMinutes
			sleepiestGuard = guard
		}
	}

	sleepiestMinute := 0
	maxMinuteCount := 0
	for minute, count := range guardSleepData[sleepiestGuard].minutes {
		if count > maxMinuteCount {
			maxMinuteCount = count
			sleepiestMinute = minute
		}
	}

	return sleepiestGuard, sleepiestMinute
}

func partTwo(guardSleepData map[int]*GuardSleep) (int, int) {
	var frequentGuard int
	frequentMinute := 0
	maxFrequency := 0

	for guard, data := range guardSleepData {
		for minute, count := range data.minutes {
			if count > maxFrequency {
				maxFrequency = count
				frequentGuard = guard
				frequentMinute = minute
			}
		}
	}

	return frequentGuard, frequentMinute
}