import React from 'react'
import ReversiBoard from './ReversiBoard'
import ScoreTable from './ScoreTable'

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
      <ScoreTable
        scores={this.state.scores}
      />
      <ReversiBoard
        board={this.state.board}
        onClickCell={this.onClickCell}
      />
    </div>

    const gameOverView =
    <div>
      <GameOverInfo
        currentPlayer={this.state.currentPlayer}
        gameOverByResignation={this.state.gameOverByResignation}
        winner={this.state.winner}
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

function TurnInfo(props) {
  const { player, currentPlayer } = props
  return (
    <div className="text-center">
      <p> You are playing as <span className="font-bold">{player}</span></p>
      {
        player === currentPlayer ?
        <p> It's your turn </p> :
        <p> It's your opponent's turn </p>
      }
    </div>
  )
}

function WinnerInfo(props) {
  // const { currentPlayer, winner } = props
  return (<h1> Winner info </h1>)
}

function ResignationInfo(props) {
  // const { currentPlayer, winner } = props
  return (<h2> Resignation info </h2>)
}

function GameOverInfo(props) {
  const { currentPlayer, gameOverByResignation, winner } = props
  if (gameOverByResignation)
    return <ResignationInfo currentPlayer={currentPlayer} winner={winner} />
  else
    return <WinnerInfo currentPlayer={currentPlayer} winner={winner} />
}
