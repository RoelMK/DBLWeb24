class Chord {
    constructor(columns, z, edgeWeightFactor) {
        this.columns = columns;
        this.z = z;
        this.average = getEdgeWeightAverage(columns, z);
        this.data = this.getData(z, edgeWeightFactor); 
    }

    /**
     * Convert to Viz.js and filter data to only display most important edges
     * Format: http://bl.ocks.org/NPashaP/ba4c802d5ef68f70c019a9706f77ebf1
     * @author Roel Koopman
     * @param {Array} z Plotly-like z-data (not inversed like in Plotly!)
     * @param {Float} averageMultiplicationFactor Factor to multiply the average with, only edges with weight > averageMultiplicationFactor * average will be returned
     * @returns Filtered data in Viz.js format
     */
    getData(z, averageMultiplicationFactor)
    {
        var data = [];  // [source, target, weight]
        for (var x = 0; x < this.columns.length; x++) {
            for (var y = 0; y < this.columns.length; y++) {
                if (z[y][x] > averageMultiplicationFactor * this.average) {
                    data.push([this.columns[x], this.columns[y], z[y][x]])
                }
            }
        }
        return data;
    }    

    /**
     * Get a chord of a focused chord diagram
     * @param {String} node Node to focus on
     * @param {*} maxNumberOfEdges Max number of edges to display in the focused diagram
     * @returns Focused chord
     */
    getFocusData(node, maxNumberOfEdges) {
        return getChordForSingleNode(this.columns, this.z, node, maxNumberOfEdges);
    }
}

/**
 * Clone a 2D-array (DO NOT USE .slice()! Does NOT work properly!!)
 * @author Roel Koopman
 * @param {Array} toClone Array to clone
 * @returns {Array} Cloned array
 */
function clone2DArray(toClone) {
    var cloned = [];
    for (var i = 0; i < toClone.length; i++) {
        cloned.push([]);
        for (var j = 0; j < toClone.length; j++) {
            cloned[i].push(toClone[i][j]);
        }
    }
    return cloned;
}

/**
 * Get a chord which shows all relations from one specific node
 * @param {Array} columns Columns in matrix
 * @param {Array} z Plotly-like z-data (not inversed like 
 * @param {Number} maxNumberOfEdges Maximum number of edges to render: 100=very smooth, 200=pretty smooth, 300=slow, >500=crash/still slow (depending on size of matrix)
 * @returns Focused chord
 */
function getChordForSingleNode(columns, z, node, maxNumberOfEdges) {
    var idOfNode = -1;
    
    // Find id of node
    for (var i = 0; i < columns.length; i++) {
        if (columns[i] == node) {
            idOfNode = i;
            break;
        }
    }
    if (idOfNode == -1) {
        return new Chord([], [], 0); // If incorrect id: return a empty chord
    }

    // Empty the array with the z-data so that only nodes with a connection to the node specified are shown
    var newZ = clone2DArray(z);
    var zOrder = [];    // Contains elements {i, j}, ordered by values in newZ at [i,j]

    for (var i = 0; i < columns.length; i++) {
        for (var j = 0; j < columns.length; j++) {
            if (i != idOfNode && j != idOfNode) {
                newZ[i][j] = 0;
            } else {
                var insertedIntoOrder = false;

                // Insert i,j into zOrder to keep track of number of elements
                for (var k = 0; k < zOrder.length; k++) {
                    if (newZ[i][j] > newZ[zOrder[k].i][zOrder[k].j]) {  // Is the element at i,j greater than the element at zOrder[k].i, zOrder[k].j?
                        // Yes: insert
                        zOrder.splice(k, 0, {i: i, j: j});
                        insertedIntoOrder = true;
                        break;
                    }
                }
                // Not inserted yet? Add it to the end of the array
                if (!insertedIntoOrder) {
                    zOrder.push({i: i, j: j});
                }
                // Check if we do not have too many elements
                if (zOrder.length > maxNumberOfEdges) {
                    newZ[zOrder[zOrder.length - 1].i][zOrder[zOrder.length - 1].j] = 0;   // Remove element in newZ which is currently the last element in zOrder.
                    zOrder.pop();   // Remove last element
                }
            }
        }
    }

    return new Chord(columns, newZ, 0); // Return chord with all the specified data
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
 * @param {Number} maxNumberOfNodes Maximum number of nodes (starts with the nodes with most connections) which will be displayed, but not including the neighbours of these nodes (these will also be displayed)
 * @param {Number} maxNumberOfEdges Maximum number of edges to render: 300=very smooth, 500=pretty smooth, 800=slow, >1200=crash
 * @returns A chord dataset which can be rendered without crashing the browser
 */
function getSummarizedChord(columns, z, maxNumberOfNodes, maxNumberOfEdges) {
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
    var newZ = clone2DArray(z);   // Clone old z
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
    var factor = 0;                 // Factor to filter least important edges
    if (numberOfEdgesWeightOverAverage > maxNumberOfEdges) {
        factor = numberOfEdgesWeightOverAverage / maxNumberOfEdges;   
    }

    // Return the resulting chord
    return new Chord(columns, newZ, factor); 
}