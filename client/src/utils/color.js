export function getBackgroundColorClass(color) {
  return `bg-${getColorClass(color)}`
}

export function getTextColorClass(color) {
  return `text-${getColorClass(color)}`
}

function getColorClass(color) {
  switch (color) {
    case 'GREEN':
      return "green-500"
    case 'BLUE':
      return "blue-500"
    case 'PURPLE':
      return "purple-500"
    case 'ORANGE':
      return "orange-500"
    case 'RED':
      return "red-500"
    default:
      return "black-500"
  }
}
