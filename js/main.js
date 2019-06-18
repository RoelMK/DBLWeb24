var matrix = null;      // Current matrix
var nodeLink = null;    // Current node-link diagram
var chord = null;       // Current chord diagram
var csv = null;         // Current csv loaded
var interactivity = new Interactivity();    // Interactivity manager

/**
 * Assign controls to search for a node and to unfocus
 * @author Roel Koopman
 */
function assignSearchNodeControls() {
    var nodeTextbox = document.getElementById('node_select');
    var btnNodeSearch = document.getElementById('btnSearchNode');
    var btnUnfocus = document.getElementById('btnUnfocus');

    btnNodeSearch.addEventListener('click', function() {
        if (nodeTextbox != null && nodeTextbox.value != null) {
            var text = nodeTextbox.value;
            interactivity.focusNode(text);
        }
    });

    btnUnfocus.addEventListener('click', function() {
        interactivity.unfocus();
    })
}

/**
 * Assign events to checkboxes to select which visualizations are visible
 * @author Roel Koopman
 * @param {String} csvPath Path to CSV file
 */
function assignVisualizationCheckboxes(csvPath) {
    var chkMatrix = document.getElementById('matrix_select');
    var chkNodeLink = document.getElementById('nodelink_select');
    var chkChord = document.getElementById('chord_select');

    chkMatrix.addEventListener('change', (event) => {
        if (event.target.checked) {
            resizeDivs(chkMatrix, chkNodeLink, chkChord, csvPath);
            if (matrix == null) visualizeCSVFile(csvPath, 'matrix', 'matrix')
        } else {
            removeVisualization('matrix', 'matrix');
            resizeDivs(chkMatrix, chkNodeLink, chkChord, csvPath);
        }
    });
    chkNodeLink.addEventListener('change', (event) => {
        if (event.target.checked) {
            resizeDivs(chkMatrix, chkNodeLink, chkChord, csvPath);
            if (nodeLink == null) visualizeCSVFile(csvPath, 'nodelink', 'nodelink')
        } else {
            removeVisualization('nodelink', 'nodelink');
            resizeDivs(chkMatrix, chkNodeLink, chkChord, csvPath);
        }
    });
    chkChord.addEventListener('change', (event) => {
        if (event.target.checked) {
            resizeDivs(chkMatrix, chkNodeLink, chkChord, csvPath);
            if (chord == null) visualizeCSVFile(csvPath, 'chord', 'chord');
        } else {
            removeVisualization('chord', 'chord');
            resizeDivs(chkMatrix, chkNodeLink, chkChord, csvPath);
        }
    });
}

/**
 * Resize the divs
 * @author Roel Koopman
 * @param {Checkbox} chkMatrix Matrix checkbox
 * @param {Checkbox} chkNodeLink NodeLink checkbox
 * @param {Checkbox} chkChord Chord checkbox
 * @param {String} csvPath Path to CSV file
 */
function resizeDivs(chkMatrix, chkNodeLink, chkChord, csvPath) {
    var checked = 0;                    // Get the number of checked checks
    if (chkMatrix.checked) checked++;
    if (chkNodeLink.checked) checked++;
    if (chkChord.checked) checked++;
    var split = 100 / checked;          // Decide the new size of the selected divs

    // Decide which div is getting which size
    var splitMatrix = 0;
    var splitNodelink = 0;
    var splitChord = 0;
    if (chkMatrix.checked) splitMatrix = split;
    if (chkNodeLink.checked) splitNodelink = split;
    if (chkChord.checked) splitChord = split;

    // Split
    var elem = document.getElementById("visBlock");
    elem.style.gridTemplateColumns = splitMatrix + "% " + splitNodelink + "% " + splitChord + "%"

    // Redraw (only required for matrix if chord is not visible (because of a bug workaround))
    if (chord != null) chord.draw(chord.mainChord.data);
    if (chord == null && matrix != null) matrix.draw();
    if (nodeLink != null) nodeLink.fitToScreen();
}

/**
 * Visualize a CSV file
 * @author Roel Koopman, Jarno Ottens
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
                nodeLink.detectDirected(csv.getMatrix().data)
                nodeLink.readCSV(csv.rawCSV)
                nodeLink.assignInteractivity(interactivity)
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
                chord = new ChordVisualization(csv.getChord(10, 300), elementID, csvPath);
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
