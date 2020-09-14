import React from 'react'

export default function TurnInfo(props) {
  const { player, currentPlayer } = props

  //hacky. this should be done on server.
  let renderedPlayer
  if (player === 'B')
    renderedPlayer = 'BLACK'
  else if (player === 'W')
    renderedPlayer = 'WHITE'
  else
    renderedPlayer = player

  return (
    <div className="text-center">
      <p> You are playing as <span className="font-bold">{renderedPlayer}</span></p>
      {
        player === currentPlayer ?
        <p> It's your turn </p> :
        <p> It's your opponent's turn </p>
      }
    </div>
  )
}
