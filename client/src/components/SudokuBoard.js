import React, { useState } from 'react'
import { getBackgroundColorClass } from '../utils/color'

export default function Sudokuboard(props) {
  const { board, blockedCells, cellColors, onCellAssignment } = props

  const numRow = board.length
  const numColumn = board[0].length

  let rows = []
  for (let rowIndex = 0; rowIndex < numRow; rowIndex++) {
    const cells = board[rowIndex].map((number, columnIndex) => {
      return (
        <SudokuCell
          number={number}
          isBlocked={blockedCells[rowIndex][columnIndex]}
          color={cellColors[rowIndex][columnIndex]}
          hasLeftBorder={columnIndex%3 === 0}
          hasTopBorder={rowIndex%3 === 0}
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

function SudokuCell(props) {
  const {
    number,
    isBlocked,
    color,
    hasLeftBorder,
    hasTopBorder
  } = props

  let cellClass = 'w-12 h-12 text-2xl flex justify-center items-center border-r border-b border-solid border-black'
  if (color !== null) {
    cellClass = `${cellClass} ${getBackgroundColorClass(color)}`
  } else if (isBlocked) {
    cellClass = `${cellClass} bg-black`
  }

  if (hasLeftBorder)
    cellClass = `${cellClass} border-l`

  if (hasTopBorder)
    cellClass = `${cellClass} border-t`

  return (
    <div
      className={cellClass}
    >
      {number}
    </div>
  )
}
