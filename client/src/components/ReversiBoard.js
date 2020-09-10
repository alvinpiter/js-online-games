import React from 'react'

export default function ReversiBoard(props) {
  const { board, onClickCell } = props

  let rows = []
  for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
    const cells = board[rowIndex].map((color, columnIndex) => {
      return (
        <ReversiCell
          key={columnIndex}
          color={color}
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

function ReversiCell(props) {
  const { color, onClickCell } = props

  if (color === null) {
    return (
      <div
        className="w-16 h-16 border-2 border-solid border-black bg-green-800"
        onClick={onClickCell}
      >
      </div>
    )
  } else {
    const colorClass = (color === 'W' ? 'bg-white' : 'bg-black')
    return (
      <div className="w-16 h-16 flex justify-center items-center border-2 border-solid border-black bg-green-800">
        <div className={`w-12 h-12 rounded-full ${colorClass}`}>
        </div>
      </div>
    )
  }
}
