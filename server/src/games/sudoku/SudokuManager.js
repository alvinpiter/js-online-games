const Sudoku = require('./Sudoku')
const getRandomPuzzleAndSolution = require('../../helpers/sudoku')
const { SudokuCellMismatchError, CellIsBlockedError } = require('../../errors')

class SudokuManager {
  constructor() {
    this.game = null
    this.userDetails = new Map()
    this.userBlockedCells = new Map()
    this.userScores = new Map()
    this.playing = false

    this.cellColors = []
  }

  startGame(actor, users) {
    this.userDetails.clear()
    this.userBlockedCells.clear()
    this.userScores.clear()
    this.cellColors = []
    for (let row = 0; row < 9; row++)
      this.cellColors.push(new Array(null, null, null, null, null, null, null, null, null))
    this.playing = true

    const { puzzle, solution } = getRandomPuzzleAndSolution(15)
    this.game = new Sudoku(puzzle, solution)

    for (let user of users) {
      const socketID = user.socketID

      this.userDetails.set(socketID, user)

      let blockedCells = []
      for (let row = 0; row < 9; row++)
        blockedCells.push(new Array(false, false, false, false, false, false, false, false, false))

      this.userBlockedCells.set(socketID, blockedCells)
      this.userScores.set(socketID, 0)
    }

    let result = []
    for (let user of users) {
      const socketID = user.socketID

      result.push({
        user,
        payload: {
          board: this.game.getBoard(),
          cellColors: this.cellColors,
          blockedCells: this.userBlockedCells.get(socketID),
          scores: this.getSortedScores()
        }
      })
    }

    return result
  }

  move(user, payload) {
    if (!this.playing)
      throw new Error('Game has not started yet')

    const { row, column, value } = payload

    if (this.userBlockedCells.get(user.socketID)[row][column])
      throw new CellIsBlockedError()

    try {
      const board = this.game.assign(row, column, value)

      this.cellColors[row][column] = user.color
      this.increaseScore(user)

      return {
        board,
        cellColors: this.cellColors,
        scores: this.getSortedScores(),
        gameOver: this.game.hasEnded()
      }
    } catch (e) {
      if (e instanceof SudokuCellMismatchError) {
        this.blockCell(user, row, column)
        throw new SudokuCellMismatchError({blockedCells: this.userBlockedCells.get(user.socketID)})
      } else
        throw e
    }
  }

  increaseScore(user) {
    const socketID = user.socketID

    const score = this.userScores.get(socketID)
    this.userScores.set(socketID, score + 1)
  }

  blockCell(user, row, column) {
    let blockedCells = this.userBlockedCells.get(user.socketID)
    blockedCells[row][column] = true

    this.userBlockedCells.set(user.socketID, blockedCells)
  }

  getSortedScores() {
    let scores = []
    for (let entry of this.userDetails) {
      const user = entry[1]
      const score = this.userScores.get(user.socketID)
      scores.push({ user, score })
    }

    const sortedScores = scores.sort((a, b) => b.score - a.score)

    return sortedScores
  }

  getNumberOfPlayers() {
    return 5
  }

  resign(actor) {
    this.playing = false
    return {
      resigner: actor
    }
  }

  isPlaying() {
    return this.playing
  }
}

module.exports = SudokuManager
