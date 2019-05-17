class Chord {
    constructor(columns, z, edgeWeightFactor) {
        this.columns = columns;
        this.data = this.getData(z, edgeWeightFactor);   
    }

    /**
     * Convert to Viz.js and filter data to only display most important edges
     * Format: http://bl.ocks.org/NPashaP/ba4c802d5ef68f70c019a9706f77ebf1
     * @author Roel Koopman
     * @param {Array} z Plotly-like z-data (not inversed like in Plotly!)
     * @param {*} averageMultiplicationFactor Factor to multiply the average with, only edges with weight > averageMultiplicationFactor * average will be returned
     * @returns Filtered data in Viz.js format
     */
    getData(z, averageMultiplicationFactor)
    {
        var average = getEdgeWeightAverage(this.columns, z);
        var data = [];  // [source, target, weight]
        for (var x = 0; x < this.columns.length; x++) {
            for (var y = 0; y < this.columns.length; y++) {
                if (z[y][x] > averageMultiplicationFactor * average) {
                    data.push([this.columns[x], this.columns[y], z[y][x]])
                }
            }
        }
        return data;
    }    
}

/**
 * Get the average weight of the edges of a matrix
 * @author Roel Koopman
 * @param {Array} columns Columns in matrix
 * @param {Array} z Plotly-like z-data (not inversed like in Plotly!)
 * @returns Average weight of edges
 */
function getEdgeWeightAverage(columns, z) {
    var total = 0;
    var n = 0;
    for (var x = 0; x < columns.length; x++) {
        for (var y = 0; y < columns.length; y++) {
            if (z[y][x] > 0) {
                total += z[y][x];
                n++;
            }
        }
    }
    return total / n;
}

/**
 * Summarizes a matrix so that it can be rendered in a chord diagram.
 * -> Shows only the most important nodes (and their neighbours)
 * -> Shows only a maximum number of edges (to prevent crashes)
 * @author Roel Koopman
 * @param {Array} columns Columns in matrix
 * @param {Array} z Plotly-like z-data (not inversed like in Plotly!)
 * @param {number} maxNumberOfNodes Maximum number of nodes (starts with the nodes with most connections) which will be displayed, but not including the neighbours of these nodes (these will also be displayed)
 * @returns A chord dataset which can be rendered without crashing the browser
 */
function getSummarizedChord(columns, z, maxNumberOfNodes) {
    // Only summarize if really required
    if (maxNumberOfNodes >= columns.length) {
        return new Chord(columns, z, 0);    // If max > number of nodes, just return a chord
    }

    // Calculate how much outgoing weight and ingoing weight each node has
    var nodesPower = [];    
    for (var i = 0; i < columns.length; i++) {
        var incoming = 0;
        var outgoing = 0;

        for (var j = 0; j < columns.length; j++) {  // Count for row
            outgoing += z[j][i];
        }

        for (var j = 0; j < columns.length; j++) {  // Count for column
            incoming += z[i][j];
        }
        nodesPower.push({id: i, in: incoming, out: outgoing}) // Save found data
    }
    
    // Find most important nodes (most outgoing + incoming weight)
    var strongestNodes = [];
    for (var i = 0; i < maxNumberOfNodes; i++) {
        var max = -1;
        var maxID = 0;

        for (var j = 0; j < nodesPower.length; j++) {
            var power = nodesPower[j].in + nodesPower[j].out;
            if (power > max) {
                max = power;
                maxID = j;
            }
        }
        strongestNodes.push(nodesPower[maxID]);
        nodesPower.splice(maxID, 1);    // Remove node after it has been added to list of strongest nodes
    }

    // Convert z-data using the found data about the strongest nodes (only keep data related to the strongest nodes)
    var numberOfEdges = 0;
    var newZ = z.slice();   // Clone old z
    for (var i = 0; i < columns.length; i++) {
        for (var j = 0; j < columns.length; j++) {
            var keep = false;
            for (var k = 0; k < strongestNodes.length; k++) {
                if (strongestNodes[k].id == j || strongestNodes[k].id == i) {  // Same row or column as one of the strongest nodes
                    keep = true;
                }
            }
            // Keep only if it is a relation to one of the strongest nodes, else set to zero
            if (!keep) {
                newZ[i][j] = 0; // Remove data
            } else {
                numberOfEdges++;
            }
        }
    }

    // Calculate the required factor for edge filtering so that it is possible for the chord to properly render
    var average = getEdgeWeightAverage(columns, newZ);  // Find average z-value
    // 1. Now, calculate the number of edges with z > average
    var numberOfEdgesWeightOverAverage = 0;
    for (var i = 0; i < columns.length; i++) {
        for (var j = 0; j < columns.length; j++) {
            if (z[i][j] > average) {
                numberOfEdgesWeightOverAverage++;
            }
        }
    }
    // 2. Find the factor to get the edges down to the required amount
    var maxNumberOfEdges = 500;     // Max number of edges to render: 300=very smooth, 500=pretty smooth, 800=slow, >1200=crash
    var factor = 0;                 // Factor to filter least important edges
    if (numberOfEdgesWeightOverAverage > maxNumberOfEdges) {
        factor = numberOfEdgesWeightOverAverage / maxNumberOfEdges;   
    }

    // Return the resulting chord
    return new Chord(columns, newZ, factor); 
}