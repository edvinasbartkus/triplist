export const COLORS = [
  '#007aff',
  '#587aff',
  '#ff2d55',
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#4cd964',
  '#5ac8fa',
  '#00c8fa',
]

export const getColor = index => {
  return COLORS[[index % COLORS.length]]
}