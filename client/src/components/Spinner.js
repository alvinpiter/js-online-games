import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function Spinner(props) {
  let { size } = props

  size = size || 60

  return (
    <div className="flex justify-center">
      <CircularProgress size={size} />
    </div>
  )
}
