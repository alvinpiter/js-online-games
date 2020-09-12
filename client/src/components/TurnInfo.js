import React from 'react'

export default function TurnInfo(props) {
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
