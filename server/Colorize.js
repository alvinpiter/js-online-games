function getRandomColor(exclusionsSet) {
  const availableColors = [
    'GREEN',
    'BLUE',
    'PURPLE',
    'ORANGE',
    'RED'
  ]

  for (let color of availableColors) {
    if (!exclusionsSet.has(color))
      return color
  }
}

module.exports = getRandomColor
