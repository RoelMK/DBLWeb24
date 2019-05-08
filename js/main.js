// Open local file
var req = new XMLHttpRequest();
req.onload = function(){
    var csv = new CSVData(this.responseText);
    loadVisualization1(csv.getMatrix());
};
req.open('GET', './data.csv');  // Test file
req.send();

/**
 * Load visualization 1
 * @param {Matrix} matrix Matrix to show
 */
function loadVisualization1(matrix) {
    var vis = new MatrixVisualization(matrix, 'canvas');
}

//const testData = [[1, 20, 30], [20, 1, 60], [30, 60, 1]]; // Constant data for testing purposes
//var matrix = new Matrix()
//matrix.setData(testData)
//matrix.randomize()
//matrix = matrix.optimalLeafOrder()