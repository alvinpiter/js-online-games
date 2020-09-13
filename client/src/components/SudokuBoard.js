import React, { useState } from 'react'
import { getBackgroundColorClass } from '../utils/color'

export default function SudokuBoard(props) {
  const { board, blockedCells, cellColors, onCellAssignment } = props
  const [selectedCell, setSelectedCell] = useState(null)

  const onSelectCell = (row, column) => {
    if (selectedCell !== null && selectedCell.row === row && selectedCell.column === column)
      setSelectedCell(null)
    else
      setSelectedCell({row, column})
  }

  const onSelectPanelCell = (number) => {
    if (selectedCell === null)
      return
    else
      onCellAssignment(selectedCell.row, selectedCell.column, number)
  }

  let rows = []
  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
    const cells = board[rowIndex].map((number, columnIndex) => {
      const isSelected = (selectedCell !== null && selectedCell.row === rowIndex && selectedCell.column === columnIndex)
      return (
        <SudokuCell
          key={columnIndex}
          number={number}
          color={cellColors[rowIndex][columnIndex]}
          isBlocked={blockedCells[rowIndex][columnIndex]}
          isSelected={isSelected}
          hasLeftBorder={columnIndex%3 === 0}
          hasTopBorder={rowIndex%3 === 0}
          onSelectCell={() => onSelectCell(rowIndex, columnIndex)}
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

      <SudokuInputPanel
        onSelectPanelCell={onSelectPanelCell}
      />
    </div>
  )
}

function SudokuCell(props) {
  const {
    number,
    color,
    isBlocked,
    isSelected,
    hasLeftBorder,
    hasTopBorder,
    onSelectCell
  } = props

  let cellClass = 'w-12 h-12 text-2xl flex justify-center items-center border-r border-b border-solid border-black'
  if (color !== null) {
    cellClass = `${cellClass} ${getBackgroundColorClass(color)}`
  } else if (isBlocked) {
    cellClass = `${cellClass} bg-black`
  } else if (isSelected) {
    cellClass = `${cellClass} bg-gray-400`
  }

  if (hasLeftBorder)
    cellClass = `${cellClass} border-l`

  if (hasTopBorder)
    cellClass = `${cellClass} border-t`

  return (
    <div
      className={cellClass}
      onClick={onSelectCell}
    >
      {number === 0 ? null : number}
    </div>
  )
}

function SudokuInputPanel(props) {
  const { onSelectPanelCell } = props

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
          key={columnIndex}
          className="w-12 h-12 text-2xl flex justify-center items-center border border-solid border-black"
          onClick={() => onSelectPanelCell(number)}
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
