import React from 'react'
import { getTextColorClass } from '../utils/color'

export default function UserSpan(props) {
  const { user } = props
  const className = `font-bold ${getTextColorClass(user.color)}`

  return <span className={className}>{user.nickname}</span>
}
