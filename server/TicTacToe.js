class TicTacToe {
  constructor() {
    this.players = ['X', 'O']

    this.reset()
  }

  reset() {
    this.currentPlayer = 'X'
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
  }

  getPlayers() {
    return this.players
  }

  getNumberOfPlayers() {
    return 2
  }

  getCurrentPlayer() {
    return this.currentPlayer
  }

  getBoard() {
    return this.board
  }

  //for testing purpose
  setBoard(board) {
    this.board = board
  }

  getNextPlayer() {
    return (this.currentPlayer === 'X' ? 'O' : 'X')
  }

  move(player, {row, column}) {
    if (player !== this.currentPlayer)
      throw new Error("It's not your turn")

    if (row === undefined || column === undefined)
      throw new Error("Invalid move")

    if (row < 0 || row >= 3 || column < 0 || column >= 3)
      throw new Error("Invalid move")

    if (this.board[row][column] !== null)
      throw new Error("Cell is not empty")

    this.board[row][column] = this.currentPlayer
    this.currentPlayer = this.getNextPlayer()

    return {
      player,
      row,
      column
    }
  }

  getWinner() {
    //picture the cells are numbered from 0 to 8 starting from top to bottom and left to right
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]

    for (let line of lines) {
      let allSame = true
      for (let cell of line) {
        const r1 = Math.floor(line[0]/3), c1 = line[0]%3
        const r2 = Math.floor(cell/3), c2 = cell%3

        if (this.board[r2][c2] !== this.board[r1][c1])
          allSame = false
      }

      const player = this.board[Math.floor(line[0]/3)][line[0]%3]
      if (allSame && player !== null)
        return player
    }

    return null
  }

  hasEnded() {
    if (this.getWinner() !== null)
      return true

    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (this.board[row][column] === null)
          return false
      }
    }

    return true
  }
}

module.exports = TicTacToe
