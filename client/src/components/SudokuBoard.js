import React, { useState } from 'react'
import { getBackgroundColorClass } from '../utils/color'

export default function SudokuBoard(props) {
  const { board, blockedCells, cellColors, onCellAssignment } = props

  let rows = []
  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
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
    <div className="flex space-x-2">
      <div>
        {rows}
      </div>

      <SudokuInputPanel />
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

function SudokuInputPanel(props) {
  const numbers = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]

  let rows = []
  for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
    const cells = numbers[rowIndex].map((number, columnIndex) => {
      return (
        <div
          className="w-12 h-12 text-2xl flex justify-center items-center border border-solid border-black"
        >
          {number}
        </div>
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
