class OutOfBoundsError extends Error {
  constructor(data) {
    super('Row or column is out of bounds')
    this.name = 'OutOfBoundsError'
    this.data = data
  }
}

class CellIsNotEmptyError extends Error {
  constructor(data) {
    super('Cell is not empty')
    this.name = 'CellIsNotEmptyError'
    this.data = data
  }
}

class SudokuCellMismatchError extends Error {
  constructor(data) {
    super('Mismatch with solution')
    this.name = 'SudokuCellMismatchError'
    this.data = data
  }
}

class RoomIsNotFullError extends Error {
  constructor(data) {
    super('Room is not full yet')
    this.name = 'RoomIsNotFullError'
    this.data = data
  }
}

class RoomIsFullError extends Error {
  constructor(data) {
    super('Room is full')
    this.name = 'RoomIsFullError'
    this.data = data
  }
}

class GameHasNotStartedError extends Error {
  constructor(data) {
    super('Game has not started')
    this.name = 'GameHasNotStartedError'
    this.data = data
  }
}

class NicknameTakenError extends Error {
  constructor(data) {
    super('Nickname taken, try something else')
    this.name = 'NicknameTakenError'
    this.data = data
  }
}

class GameIsOnGoingError extends Error {
  constructor(data) {
    super('Game is on going')
    this.name = 'GameIsOnGoingError'
    this.data = data
  }
}

module.exports = {
  OutOfBoundsError,
  CellIsNotEmptyError,
  SudokuCellMismatchError,
  RoomIsNotFullError,
  RoomIsFullError,
  GameHasNotStartedError,
  NicknameTakenError,
  GameIsOnGoingError
}
