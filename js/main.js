var matrix = null;      // Current matrix
var nodeLink = null;    // Current node-link diagram
var chord = null;       // Current chord diagram
var csv = null;         // Current csv loaded
var interactivity = new Interactivity();    // Interactivity manager

/**
 * Visualize a CSV file
 * @author Roel Koopman
 * @param {String} csvPath Path to CSV file
 * @param {String} visualizationType Type of visualization to load (matrix/nodelink/chord)
 * @param {String} elementID ID of the div to show the visualization in
 * @param {Boolean} loop Normally false, do not set true, except when executing this code in a loop to prevent crashes
 */
function visualizeCSVFile(csvPath, visualizationType, elementID, loop = false) {
    if (csv != null && csv.path == csvPath) {
        // Load specified visualization
        switch(visualizationType.toLowerCase()) {
            case 'matrix':
                matrix = new MatrixVisualization(csv.getMatrix(), elementID);
                break;
            case 'nodelink':
                nodeLink = new NodeLinkVisualization(elementID);
                debugger
                nodeLink.readCSV(csv.rawCSV);
                nodeLink.assignButtons({
                  togglePhysics: document.getElementById('button1'),
                  toggleEdgeSmoothing: document.getElementById('button2'),
                  toggleEdges: document.getElementById('button3'),
                  fitToScreen: document.getElementById('button4')
                })
                nodeLink.assignSliders({
                  setMinComponentSize: document.getElementById('slider1'),
                  setMinConnectivity: document.getElementById('slider2')
                })
                nodeLink.assignDropdowns({
                  setLayout: document.getElementById('select1')
                })
                break;
            case 'chord':
                chord = new ChordVisualization(csv.getChord(10, 300), elementID);
                break;
        }
    } else if(!loop) {
        loadCSV(csvPath, visualizationType, elementID); // Load the CSV, then re-execute this method
    }
}

/**
 * Load a CSV file
 * @author Roel Koopman
 * @param {String} csvPath Path to the CSV file
 * @param {String} visualizationType Type of visualization to load (matrix/nodelink/chord)
 * @param {String} elementID ID of the div to show the visualization in
 */
function loadCSV(csvPath, visualizationType, elementID) {
    var req = new XMLHttpRequest();
    req.onload = function() {
        csv = new CSVData(this.responseText, csvPath);
        visualizeCSVFile(csvPath, visualizationType, elementID, true)
    };
    req.open('GET', csvPath);
    req.send();
}
