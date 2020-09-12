import React from 'react'
import TicTacToeBoard from './TicTacToeBoard'
import WinnerInfo from './WinnerInfo'

export default class TicTacToeGame extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      player: null,
      currentPlayer: null,
      board: null,
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
    const { player, currentPlayer, board } = data

    this.setState({
      player,
      currentPlayer,
      board,
      stage: 'USER_PLAYING'
    })
  }

  handleMoveAccepted(data) {
    const { currentPlayer, board, gameOverInfo } = data

    this.setState({ currentPlayer, board })

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
    this.setState({
      stage: 'GAME_OVER',
      gameOverByResignation: true,
      winner: data.winner
    })
  }

  onClickCell = (row, column) => {
    this.props.onMove({ row, column })
  }

  render() {
    const userInView = null

    const userPlayingView =
    <div>
      <TurnInfo
        player={this.state.player}
        currentPlayer={this.state.currentPlayer}
      />
      <TicTacToeBoard
        board={this.state.board}
        onClickCell={this.onClickCell}
      />
    </div>

    const gameOverView =
    <div>
      <GameOverInfo
        player={this.state.player}
        gameOverByResignation={this.state.gameOverByResignation}
        winner={this.state.winner}
      />
      <TicTacToeBoard
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

function TurnInfo(props) {
  const { player, currentPlayer } = props
  return (
    <div className="text-center space-y-2">
      <p> You are playing as <span className="font-bold">{player}</span></p>
      {
        player === currentPlayer ?
        <p> It's your turn </p> :
        <p> It's your opponent's turn </p>
      }
    </div>
  )
}

function ResignationInfo(props) {
  // const { currentPlayer, winner } = props
  return (<h2> Resignation info </h2>)
}

function GameOverInfo(props) {
  const { player, gameOverByResignation, winner } = props
  if (gameOverByResignation)
    return <ResignationInfo player={player} winner={winner} />
  else
    return <WinnerInfo player={player} winner={winner} />
}
