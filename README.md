# CGoL Cellular Automata

For Lazy Gamers...

The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.
The "game" is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves.

### RULES :
The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead. Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

1) Any live cell with fewer than two (0 or 1, or <= 1) live neighbours dies, as if caused by under-population (isolation).

2) Any live cell with two or three live neighbours lives on to the next generation.

3) Any live cell with more than three live neighbours (>= 4) dies, as if by overcrowding (over-population).

4) Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.


The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed—births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick (in other words, each generation is a pure function of the preceding one). The rules continue to be applied repeatedly to create further generations.

### URL
telodigrade.com/gol

## Implementation:
HTML5, CSS/SASS/Foundation, JavaScript, socket.io

## Resources:
http://en.wikipedia.org/wiki/Conway's_Game_of_Life

### Instructions

Run from URL specified, above

or

1. clone repository
2. npm install
3. http-server
