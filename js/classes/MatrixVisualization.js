class MatrixVisualization {
    /**
     * Initializes the matrix, automatically draws it.
     * @author Roel Koopman
     * @param {Matrix} dataToVisualize Converted unordered data
     * @param {string} elementID ID of the div to display the visualization in
     */
    constructor(dataToVisualize, elementID) {
        this.plot = document.getElementById(elementID);         // Plot
        this.visualizationData = dataToVisualize;   // Copy the matrix data
        this.visibleData = dataToVisualize.asPlotly();  // Visible data in the matrix in plotly format
        this.draw();    // Draw the matrix
    }

    /**
     * Draw the matrix
     * @author Roel Koopman
     */
    draw() {      
        var plotlyInput =  [{
            z: this.visibleData.z,
            x: this.visibleData.x,
            y: this.visibleData.y,
            name: 'Test',
            visible: true,
            colorscale: 'Blackbody',    // Default
            type: 'heatmap',
            colorbar: {x: -0.15},       // Move the colorbar to the left side of the plot
            xgap: 0.05,                 // Add a grid
            ygap: 0.05
        }];

        Plotly.newPlot(this.plot, plotlyInput, this.generateLayout());
        this.setInteraction();
    }

    /**
     * Change the order of the data in the matrix
     * @author Roel Koopman
     * @param {String} order New order to use (base/barycenter/optimalleaf/sort/pca)
     * @param {Object} args Arguments to apply when reordering (args.perm_type, args.linkage_type, args.distance_name), not for every ordering required
     */
    changeOrder(order, args) { 
        // Check if visualization does not have too many matrices
        if (this.dataToVisualize.data.length > 100) {   // TODO: magic number 100
            return; // Quit if so, do not change anything
        }

        // Check which order we should use and apply it
        switch(order.toLowerCase()) {
            case 'base':
                this.updateData(this.dataToVisualize.asPlotly());
                break;
            case 'barycenter':
                this.updateData(this.dataToVisualize.barycenterOrder().asPlotly());
                break;
            case 'topological':
                this.updateData(this.dataToVisualize.topologicalOrder(args.perm_type).asPlotly())
                break;
            case 'hierarchical': 
                this.updateData(this.dataToVisualize.hierarchicalOrder(args.perm_type, args.linkage_type, args.distance_name).asPlotly())
                break;
            case 'optimalleaf':
                this.updateData(this.dataToVisualize.optimalLeafOrder(args.perm_type, args.linkage_type, args.distance_name).asPlotly());
                break;
            case 'pca':
                this.updateData(this.dataToVisualize.pcaOrder(args.perm_type).asPlotly());
                break;
        }
    }

    /**
     * Update the content of the matrix
     * @author Roel Koopman
     * @param {Object} plotlyData Plotly matrix data
     */
    updateData(plotlyData) {
        this.visibleData = plotlyData;
        var update = {
            z: plotlyData.z,
            x: plotlyData.x,
            y: plotlyData.y
        };
        Plotly.restyle(this.plot, update);
    }

    /**
     * Change the color of the plot 
     * @author Roel Koopman
     * @param {String} color New color (Blackbody, Electric, Greens, Greys, Earth, Bluered, Portland, Picnic, Jet, Hot)
     */
    changeColor(color) {
        var update = {
            colorscale: color
        };
        Plotly.restyle(this.plot, update);
    }

    /**
     * Focus on a node
     * @param {String} node Node to fucus on
     */
    focusNode(node) {
        focus(node, node);
    }

    /**
     * Focus on an edge
     * @author Roel Koopman
     * @param {String} nodeFrom Node where the edge originates from
     * @param {String} nodeTo Node where the edge goes to
     */
    focusEdge(nodeFrom, nodeTo) {
        // Find x
        var x_idOfNode = -1;
        var x_extension = Math.min(5, this.visibleData.x.length);
        for (var i = 0; i < this.visibleData.x.length; i++) {
            if (nodeTo == this.visibleData.x[i]) {
                x_idOfNode = i;
                break;
            }
        }

        if (x_idOfNode == -1) {
            return;
        } 

        // Find y
        var y_idOfNode = -1;
        var y_extension = Math.min(5, this.visibleData.y.length); 
        for (var i = 0; i < this.visibleData.y.length; i++) {
            if (nodeFrom == this.visibleData.y[i]) {
                y_idOfNode = i;
                break;
            }
        }

        if (y_idOfNode == -1) {
            return;
        } 

        // Update the plot
        Plotly.relayout(this.plot, this.generateLayout([x_idOfNode - x_extension, x_idOfNode + x_extension], [y_idOfNode - y_extension, y_idOfNode + y_extension]));
    }

    /**
     * Unfocus
     */
    unfocus() {
        Plotly.relayout(this.plot, this.generateLayout());
    }

    /**
     * Generate the layout of the visualization
     * @author Roel Koopman
     * @returns Layout (for plotly)
     */
    generateLayout() {
        return generateLayout([], []);
    }

    /**
     * Generate the layout of the visualization
     * @author Roel Koopman
     * @param {Array} xrange Range of ids to show on x-axis
     * @param {Array} yrange Range of ids to show on y-axis
     */
    generateLayout(xrange, yrange) {
        return {
            title: 'Adjacency Matrix',
            annotations: [],
            xaxis: {
              range: xrange,
              ticks: '',
              tickfont: {
                size: 8
                }
            },
            yaxis: {
              range: yrange,
              ticks: '',
              side: 'right', 
              tickfont: {
                  size: 8
              }
            }
        }
    }

    /**
     * Initialize the interaction class (always run after draw)
     * @author Roel Koopman
     */
    setInteraction() {
        this.interaction = new MatrixInteraction(this);
        this.plot.on('plotly_click', this.interaction.matrixClick);
        this.plot.on('plotly_hover', this.interaction.matrixHover);
        this.plot.on('plotly_unhover', this.interaction.matrixUnhover);
        this.plot.on('plotly_relayout', this.interaction.matrixZoom);
    }


    assignUIComponents(components) {
        components.btnApplyOrder.addEventListener("click", this.changeOrder('', {perm_type: null, linkage_type: null, distance_name: null}));
        components.listColor.addEventListener('change', this.changeColor(''));
    }


    //
    //
    // ---------------------------------------- OBSOLETE ----------------------------------------
    /**
     * Generate the data for Plotly
     * @author Roel Koopman
     * @returns Array with all data
     */
    generateData() {
        var data = [];
        for (var i = 0; i < this.visualizationData.length; i++) { // Obsolete, but left in the code because of it possible uses in the future
            data.push(this.makeTrace(i));   // Push every dataset
        }
        return data;
    }

    /**
     * Generate one of the datasets
     * @author Roel Koopman
     * @param {number} i ID of the dataset
     * @returns Data for the specified ID
     */
    makeTrace(i) {
        var xyz = this.getXYZData(i);
        return {
            z: xyz.z,
            x: xyz.x,
            y: xyz.y,
            visible: i === 0,           // Display data for default (i=0)
            colorscale: 'Blackbody',    // Default
            name: 'Data set ' + i,
            type: 'heatmap',
            colorbar: {x: -0.15},       // Move the colorbar to the left side of the plot
            xgap: 0.05,                 // Add a grid
            ygap: 0.05
        };
    }

    /**
     * Get the xyz-data belonging to an ID
     * @author Roel Koopman
     * @param {number} i ID of the dataset
     * @returns x,y,z-data
     */
    getXYZData(i) {
        if (i < this.visualizationData.length) {
            var plotlyData = this.visualizationData[i].asPlotly();
            return {
                z: plotlyData.z,
                x: plotlyData.x,
                y: plotlyData.y,
            };
        } else {
            return {
                z: [[i, i + 1, i + 2], [2*i, 2*i, 2*i]] // Dummy data
            };  
        }
    }
    //
    // END OBSOLETE
    //
}
