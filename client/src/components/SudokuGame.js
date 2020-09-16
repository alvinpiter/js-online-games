import React from 'react'
import ScoreTable from './ScoreTable'
import SudokuBoard from './SudokuBoard'
import ResignationInfo from './ResignationInfo'

export default class SudokuGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      board: null,
      cellColors: null,
      blockedCells: null,
      scores: null,
      stage: 'USER_IN',
      gameOverByResignation: false,
      resigner: null
    }
  }

  handleEvent(type, data) {
    switch (type) {
      case 'START_GAME_ACCEPTED':
        this.handleStartGameAccepted(data)
        break
      case 'MOVE_ACCEPTED':
        this.handleMoveAccepted(data)
        break
      case 'MOVE_REJECTED':
        this.handleMoveRejected(data)
        break
      case 'RESIGN_ACCEPTED':
        this.handleResignAccepted(data)
        break
      default:
        console.error(`Event ${type} is not handled in SudokuGame`)
    }
  }

  handleStartGameAccepted(data) {
    const { board, cellColors, blockedCells, scores } = data

    this.setState({
      board,
      cellColors,
      blockedCells,
      scores,
      stage: 'USER_PLAYING'
    })
  }

  handleMoveAccepted(data) {
    const { board, cellColors, scores, gameOver } = data

    this.setState({ board, cellColors, scores })

    if (gameOver) {
      this.setState({ stage: 'GAME_OVER', gameOverByResignation: false })
    }
  }

  handleMoveRejected(response) {
    const { data } = response

    if (data !== undefined) {
      const { blockedCells, gameOver } = data

      this.setState({ blockedCells })
      if (gameOver) {
        this.setState({ stage: 'GAME_OVER', gameOverByResignation: false})
      }
    }
  }

  handleResignAccepted(data) {
    this.setState({
      stage: 'GAME_OVER',
      gameOverByResignation: true,
      resigner: data.resigner
    })
  }

  onCellAssignment = (row, column, value) => {
    this.props.onMove({ row, column, value })
  }

  render() {
    const sudokuBoard =
    <SudokuBoard
      board={this.state.board}
      blockedCells={this.state.blockedCells}
      cellColors={this.state.cellColors}
      onCellAssignment={this.onCellAssignment}
    />

    const userInView = null

    const userPlayingView =
    <div className="space-y-2">
      <ScoreTable scores={this.state.scores} />
      {sudokuBoard}
    </div>

    const gameOverView =
    <div className="space-y-2">
      <GameOverInfo
        gameOverByResignation={this.state.gameOverByResignation}
        resigner={this.state.resigner}
      />
      <ScoreTable scores={this.state.scores} />
      {sudokuBoard}
    </div>

    switch (this.state.stage) {
      case 'USER_IN':
        return userInView
      case 'USER_PLAYING':
        return userPlayingView
      case 'GAME_OVER':
        return gameOverView
      default:
        return null
    }
  }
}

function GameOverInfo(props) {
  const { gameOverByResignation, resigner } = props

  return (
    <div>
      {
        gameOverByResignation ?
        <ResignationInfo resigner={resigner} /> :
        <div className="text-xl text-center font-bold">
          <p> Game over! </p>
        </div>
      }
    </div>
  )
}
