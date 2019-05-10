/**
 * Load a local CSV file
 * @author Roel Koopman
 * @param {string} path Path to CSV file
 * @param {string} elementID ID of the div to display the visualization in
 */
function visualizeCSVFile(path, elementID) {
    var req = new XMLHttpRequest();
    req.onload = function(){
        var csv = new CSVData(this.responseText);
        var vis1 = loadVisualization1(csv.getMatrix(), elementID);   // csv.getMatrix()
    };
    req.open('GET', path); 
    req.send();
}

/**
 * Load visualization 1
 * @author Roel Koopman
 * @param {Matrix} matrix Matrix to show
 * @param {string} elementID ID of the div to display the visualization in
 * @returns {MatrixVisualization} Loaded matrix
 */
function loadVisualization1(matrix, elementID) {
    return new MatrixVisualization(matrix, elementID);
}