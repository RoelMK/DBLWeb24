var matrix = null;      // Current matrix
var nodeLink = null;    // Current node-link diagram
var chord = null;       // Current chord diagram
var csv = null;         // Current csv loaded
var interactivity = new Interactivity();    // Interactivity manager

/**
 * Assign events to checkboxes to select which visualizations are visible
 * @param {String} csvPath Path to CSV file
 */
function assignVisualizationCheckboxes(csvPath) {
    var chkMatrix = document.getElementById('matrix_select');
    var chkNodeLink = document.getElementById('nodelink_select');
    var chkChord = document.getElementById('chord_select');

    chkMatrix.addEventListener('change', (event) => {
        if (event.target.checked) {
            if (matrix == null) visualizeCSVFile(csvPath, 'matrix', 'matrix')
        } else {
            removeVisualization('matrix', 'matrix');
        }
    });
    chkNodeLink.addEventListener('change', (event) => {
        if (event.target.checked) {
            if (nodeLink == null) visualizeCSVFile(csvPath, 'nodelink', 'nodelink')
        } else {
            removeVisualization('nodelink', 'nodelink');
        }
    });
    chkChord.addEventListener('change', (event) => {
        if (event.target.checked) {
            if (chord == null) visualizeCSVFile(csvPath, 'chord', 'chord')
        } else {
            removeVisualization('chord', 'chord');
        }
    });
}

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
                matrix.assignUIComponents({
                    btnApplyOrder: document.getElementById('applyOrdering'),
                    orderingsDropdown: document.getElementById('algorithm_selector'),
                    colorDropdown: document.getElementById('color_selector'), // TODO
                    topologicalPermutationDropdown: document.getElementById('topoPermutation'),
                    hierachicalPermutationDropdown: document.getElementById('hierPermutation'),
                    hierachicalLinkageDropdown: document.getElementById('hierLink'),
                    hierachicalDistanceDropdown: document.getElementById('hierDistance'),
                    optimalLeafPermutationDropdown: document.getElementById('optPermutation'),
                    optimalLeafLinkageDropdown: document.getElementById('optLink'),
                    optimalLeafDistanceDropdown: document.getElementById('optDistance'),
                    pcaPermutationDropdown: document.getElementById('pcaPermutation')
                });
                break;
            case 'nodelink':
                nodeLink = new NodeLinkVisualization(elementID);
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
 * Remove a loaded visualization
 * @param {String} visualizationType Type of visualization to remove (matrix/nodelink/chord)
 * @param {String} elementID ID of the div where the visualization is shown
 */
function removeVisualization(visualizationType, elementID) {
    var div = document.getElementById(elementID);
    div.innerHTML = "";     // Reset div content

    switch(visualizationType.toLowerCase()) {
        case 'matrix':
            matrix = null;
            break;
        case 'nodelink':
            nodeLink = null;
            break;
        case 'chord':
            chord = null;
            break;
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
