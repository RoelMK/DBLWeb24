/**
 * Load a local CSV file
 * @author Roel Koopman
 * @param {string} path Path to CSV file
 * @param {string} elementID_vis1 ID of the div to display the first visualization in
 * @param {string} elementID_vis2 ID of the div to display the second visualization in
 * @param {string} elementID_vis3 ID of the div to display the third visualization in
 */
function visualizeCSVFile(path, elementID_vis1, elementID_vis2, elementID_vis3) {
    var req = new XMLHttpRequest();
    req.onload = function(){
        var csv = new CSVData(this.responseText);
        if (elementID_vis1 != null) var vis1 = loadVisualization1(csv.getMatrix(), elementID_vis1); 
        if (elementID_vis3 != null) var vis3 = loadVisualization3(csv.getChord(25, 500), elementID_vis3); 
        //if (elementID_vis3 != null) var vis3 = loadVisualization3(csv.getSingleChord("Edward_Tufte", 200), elementID_vis3);   
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

/**
 * Load visualization 3
 * @author Roel Koopman
 * @param {Chord} chord 
 * @param {string} elementID 
 */
function loadVisualization3(chord, elementID) {
    return new ChordVisualization(chord, elementID);
}