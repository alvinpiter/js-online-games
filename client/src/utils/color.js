export function getTextColorClass(color) {
  switch (color) {
    case 'GREEN':
      return "text-green-500"
    case 'BLUE':
      return "text-blue-500"
    case 'PURPLE':
      return "text-purple-500"
    case 'ORANGE':
      return "text-orange-500"
    case 'RED':
      return "text-red-500"
    default:
      return "text-black-500"
  }
}
