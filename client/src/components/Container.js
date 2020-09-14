import React from 'react'

export default function Container(props) {
  return (
    <div className="flex justify-center">
      <div className="w-5/6 bg-gray-100 p-4 space-y-4">
        {props.children}
      </div>
    </div>
  )
}
