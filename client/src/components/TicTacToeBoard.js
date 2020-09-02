import React from 'react'

export default function TicTacToeBoard(props) {
  const { board, onClickCell } = props

  let rows = []
  for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
    const cells = board[rowIndex].map((char, columnIndex) => {
      return (
        <TicTacToeCell
          key={columnIndex}
          character={char}
          onClickCell={() => onClickCell(rowIndex, columnIndex)}
        />
      )
    })

    const row =
    <div key={rowIndex} className="flex">
      {cells}
    </div>

    rows.push(row)
  }

  return (
    <div>
      {rows}
    </div>
  )
}

function TicTacToeCell(props) {
  const { character, onClickCell } = props

  return (
    <div
      className="w-16 h-16 text-4xl flex justify-center items-center border-2 border-solid border-black"
      onClick={onClickCell}
    >
      {character}
    </div>
  )
}
