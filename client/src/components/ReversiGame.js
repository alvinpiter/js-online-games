import React from 'react'
import ReversiBoard from './ReversiBoard'
import ScoreTable from './ScoreTable'
import TurnInfo from './TurnInfo'
import WinnerInfo from './WinnerInfo'
import ResignationInfo from './ResignationInfo'

export default class ReversiGame extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      player: null,
      currentPlayer: null,
      board: null,
      scores: null,
      stage: 'USER_IN',
      gameOverByResignation: false,
      winner: null
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
        console.error(`Event ${type} is not handled in TicTacToeGame`)
    }
  }

  handleStartGameAccepted(data) {
    const { player, currentPlayer, board, scores } = data

    this.setState({
      player,
      currentPlayer,
      board,
      scores,
      stage: 'USER_PLAYING'
    })
  }

  handleMoveAccepted(data) {
    const { currentPlayer, board, scores, gameOverInfo } = data

    this.setState({ currentPlayer, board, scores })

    if (gameOverInfo !== undefined) {
      this.setState({
        stage: 'GAME_OVER',
        gameOverByResignation: false,
        winner: gameOverInfo.winner
      })
    }
  }

  handleMoveRejected(data) {
    console.log(data)
  }

  handleResignAccepted(data) {
    const { resigner } = data
    this.setState({
      stage: 'GAME_OVER',
      gameOverByResignation: true,
      resigner
    })
  }

  onClickCell = (row, column) => {
    this.props.onMove({ row, column })
  }

  render() {
    const userInView = null

    const userPlayingView =
    <div className="space-y-2">
      <TurnInfo
        player={this.state.player}
        currentPlayer={this.state.currentPlayer}
      />
      <ScoreTable
        scores={this.state.scores}
      />
      <ReversiBoard
        board={this.state.board}
        onClickCell={this.onClickCell}
      />
    </div>

    const gameOverView =
    <div className="space-y-2">
      <GameOverInfo
        gameOverByResignation={this.state.gameOverByResignation}
        resigner={this.state.resigner}
        winner={this.state.winner}
        player={this.state.player}
      />
      <ScoreTable
        scores={this.state.scores}
      />
      <ReversiBoard
        board={this.state.board}
        onClickCell={this.onClickCell}
      />
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
  const { gameOverByResignation, resigner, winner, player } = props
  if (gameOverByResignation)
    return <ResignationInfo resigner={resigner} />
  else
    return <WinnerInfo player={player} winner={winner} />
}
