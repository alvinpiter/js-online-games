const {
  NotYourTurnError,
  InvalidMoveError,
  CellIsNotEmptyError,
  OutOfBoundsError
} = require('../../errors')

class Reversi {
  constructor() {
    this.players = ['W', 'B']
    this.reset()
  }

  reset() {
    this.currentPlayer = 'W'
    this.board = []
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      let row = []
      for (let columnIndex = 0; columnIndex < 8; columnIndex++)
        row.push(null)

      this.board.push(row)
    }

    this.board[3][3] = 'W'
    this.board[3][4] = 'B'
    this.board[4][3] = 'B'
    this.board[4][4] = 'W'
  }

  getPlayers() {
    return this.players
  }

  getNumberOfPlayers() {
    return 2
  }

  getOppositePlayer(player) {
    return (player === 'B' ? 'W' : 'B')
  }

  getCurrentPlayer() {
    return this.currentPlayer
  }

  getNextPlayer() {
    return this.getOppositePlayer(this.currentPlayer)
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player
  }

  getBoard() {
    return this.board
  }

  setBoard(board) {
    this.board = board
  }

  move(player, { row, column }) {
    if (player !== this.currentPlayer)
      throw new NotYourTurnError()

    if (!this.isInsideBoard(row, column))
      throw new OutOfBoundsError()

    if (this.board[row][column] !== null)
      throw new CellIsNotEmptyError()

    const flippedCells = this.getFlippedCells(player, row, column)
    if (flippedCells.length === 0)
      throw new InvalidMoveError()

    this.flipCells(flippedCells)
    this.board[row][column] = player
    this.currentPlayer = this.getNextPlayer()

    return this.board
  }

  hasEnded() {
    //find a valid move for current player
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        if (this.board[row][column] === null) {
          if (this.getFlippedCells(this.currentPlayer, row, column).length > 0)
            return false
        }
      }
    }

    return true
  }

  //Return array of flipped cells if player put a piece at (row, column)
  getFlippedCells(player, row, column) {
    let flippedCells = []

    for (let dr = -1; dr < 2; dr++) {
      for (let dc = -1; dc < 2; dc++) {
        //find the first piece in this direction that is equal to player
        let nxtR = row + dr
        let nxtC = column + dc

        while (this.isInsideBoard(nxtR, nxtC) && this.board[nxtR][nxtC] !== null && this.board[nxtR][nxtC] !== player) {
          nxtR += dr
          nxtC += dc
        }

        if (!this.isInsideBoard(nxtR, nxtC) || this.board[nxtR][nxtC] !== player)
          continue

        //there is a piece in this direction that is equal to player and
        //all piece between them are opponent's piece
        let currentR = row + dr
        let currentC = column + dc
        while (currentR !== nxtR || currentC !== nxtC) {
          flippedCells.push([currentR, currentC])
          currentR += dr
          currentC += dc
        }
      }
    }

    return flippedCells
  }

  flipCells(cells) {
    for (let cell of cells) {
      const [row, column] = cell
      this.board[row][column] = this.getOppositePlayer(this.board[row][column])
    }
  }

  getScore() {
    let numWhite = 0, numBlack = 0
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        if (this.board[row][column] === 'W')
          numWhite += 1

        if (this.board[row][column] === 'B')
          numBlack += 1
      }
    }

    return {
      'W': numWhite,
      'B': numBlack
    }
  }

  getWinner() {
    const score = this.getScore()
    if (score['W'] === score['B'])
      return null
    else if (score['W'] < score['B'])
      return 'B'
    else
      return 'W'
  }

  isInsideBoard(row, column) {
    return row >= 0 && row < 8 && column >= 0 && column < 8
  }
}

module.exports = Reversi
