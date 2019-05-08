const testData = [[1, 20, 30], [20, 1, 60], [30, 60, 1]]; // Constant data for testing purposes
const testData2 = [[0, 6, 8, 9, 8, 8], [5, 6, 2, 7, 4, 0], [9, 7, 6, 2, 9, 8], [2, 6, 0, 3, 6, 1], [5, 8, 7, 6, 9, 7], [4, 1, 5, 3, 3, 1]]; // Constant data for testing purposes V2

var matrix = new Matrix()
matrix.setData(testData2)
//matrix.randomize()
matrix = matrix.barycenterOrder()

var vis = new MatrixVisualization(matrix, 'canvas');
