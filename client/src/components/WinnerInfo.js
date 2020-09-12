import React from 'react'

export default function WinnerInfo(props) {
  const { player, winner } = props

  let winnerInfo
  if (winner === null) {
    winnerInfo = <p> Game over! It's a tie </p>
  } else if (player === winner) {
    winnerInfo = <p> Game over! <span className="text-green-500"> You win! </span></p>
  } else {
    winnerInfo = <p> Game over! <span className="text-red-500"> You lose! </span></p>
  }

  return (
    <div className="text-xl text-center font-bold">
      {winnerInfo}
    </div>
  )
}
