const testData = [[1, 20, 30], [20, 1, 60], [30, 60, 1]]; // Constant data for testing purposes

var matrix = new Matrix()
matrix.setData(testData)
matrix.setDefaultLabels()
matrix = matrix.reorderOptimalLeafOrder()

var vis = new MatrixVisualization(matrix, 'canvas');
