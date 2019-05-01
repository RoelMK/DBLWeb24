var vis = new MatrixVisualization({
  elementId: 'canvas'
})

var matrix = new AdjacencyMatrix({
  size: 10,
  random: true
})

vis.drawAdjacencyMatrix(matrix)
