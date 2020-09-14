function shuffle(array) {
  let arr = array.slice()

  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  return arr
}

function generateSolutionRecursively(board, row, column) {
  if (row === 9)
    return true

  const shuffledNumbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
  for (let number of shuffledNumbers) {
    //Check if we can put number at (row, column)

    let can = true

    //check if number has been used in this row
    for (let c = 0; c < 9 && can; c++) {
      if (board[row][c] === number)
        can = false
    }

    //check if number has been used in this column
    for (let r = 0; r < 9 && can; r++) {
      if (board[r][column] === number)
        can = false
    }

    //check if number has been used in current 3x3 grid
    let topR = Math.floor(row/3) * 3//top-left row of current 3x3 grid
    let topC = Math.floor(column/3) * 3 //top-left column of current 3x3 grid
    for (let r = topR; r < topR + 3 && can; r++) {
      for (let c = topC; c < topC + 3 && can; c++) {
        if (board[r][c] === number)
          can = false;
      }
    }

    if (can) {
      board[row][column] = number

      let nextRow, nextColumn
      if (column < 8) {
        nextRow = row
        nextColumn = column + 1
      } else {
        nextRow = row + 1
        nextColumn = 0
      }

      if (generateSolutionRecursively(board, nextRow, nextColumn))
        return true

      board[row][column] = 0
    }
  }

  return false
}

//Returns a 2D array of numbers which is a valid sudoku solution
function generateSolution() {
  //initialy, fill the board with 0's
  let board = []
  for (let row = 0; row < 9; row++)
    board.push((new Array(9)).fill(0))

  generateSolutionRecursively(board, 0, 0)

  return board
}

//Given a 2D array of numbers, randomly empty 'remaining' cells
//Emptying a cell means assigning 0 to that cell
function emptySomeCells(board, remaining) {
  let newBoard = []
  for (let row = 0; row < 9; row++)
    newBoard.push(board[row].slice())

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      if (newBoard[row][column] > 0) {
        const randomNumber = Math.floor(Math.random() * 10)

        //20% chance of emptying a cell so the empty cells are quite distributed.
        if (randomNumber < 2 && remaining > 0) {
          newBoard[row][column] = 0
          remaining -= 1
        }
      }
    }
  }

  if (remaining > 0)
    return emptySomeCells(newBoard, remaining)
  else
    return newBoard
}

function getRandomPuzzleAndSolution(numberOfEmptyCells) {
  const solution = generateSolution()
  const puzzle = emptySomeCells(solution, numberOfEmptyCells)

  return {
    puzzle,
    solution
  }
}

module.exports = getRandomPuzzleAndSolution
