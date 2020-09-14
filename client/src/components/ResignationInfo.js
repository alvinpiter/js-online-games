import React from 'react'
import UserSpan from './UserSpan'

export default function ResignationInfo(props) {
  const { resigner } = props

  return (
    <div className="text-xl text-center font-bold">
      <UserSpan user={resigner} /> ended the game
    </div>
  )
}
