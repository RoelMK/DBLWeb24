class MatrixVisualization {
    /**
     * Initializes the matrix, automatically draws it.
     * @author Roel Koopman
     * @param {Matrix} dataToVisualize Converted data
     * @param {string} elementID ID of the div to display the visualization in
     */
    constructor(dataToVisualize, elementID) {
        this.plot = document.getElementById(elementID);         // Plot
        this.visualizationData = [dataToVisualize.asPlotly()];  // Base data (visualizationData[0])
        this.elementID = elementID;                             // Element ID: id of the div
        this.draw();
    }

    /**
     * Draw the matrix
     * @author Roel Koopman
     */
    draw() {
        Plotly.newPlot(this.plot, this.generateData(), this.generateMenus());
        this.setInteraction();
    }

    /**
     * Generate the menus to show in the visualization
     * @author Roel Koopman
     */
    generateMenus() {
        return {updatemenus: [
        {   // Menu 1: color
            xanchor: 'left',
            yanchor: 'top',
            y: 1.1,
            x: 0,
            buttons: [{
                method: 'restyle',
                args: ['colorscale', 'Electric'],
                label: 'Electric'
            }, {
                method: 'restyle',
                args: ['colorscale', 'Greens'],
                label: 'Greens'
            }, {
                method: 'restyle',
                args: ['colorscale', 'Greys'],
                label: 'Greys'
            }]
        }, {    // Menu 2: data set
            xanchor: 'left',
            yanchor: 'top',
            y: 1.1,
            x: 0.2,
            buttons: [{
                method: 'restyle',
                args: ['visible', [true, false, false, false, false]],
                label: 'Data set 0'
            }, {
                method: 'restyle',
                args: ['visible', [false, true, false, false, false]],
                label: 'Data set 1'
            }, {
                method: 'restyle',
                args: ['visible', [false, false, true, false, false]],
                label: 'Data set 2'
            }, {
                method: 'restyle',
                args: ['visible', [false, false, false, true, false]],
                label: 'Data set 3'
            }, {
                method: 'restyle',
                args: ['visible', [false, false, false, false, true]],
                label: 'Data set 4'
            }]
        }]}
    }

    /**
     * Generate the data for Plotly
     * @author Roel Koopman
     * @returns Array with all data
     */
    generateData() {
        var data = [];
        for (var i = 0; i < 5; i++) {       // 5 data sets
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
        return {
            z: this.getZData(i),
            visible: i === 0,       // Display data for default (i=0)
            colorscale: 'Electric', // Default
            name: 'Data set ' + i,
            type: 'heatmap',
        };
    }

    /**
     * Get the Z-data belonging to an ID
     * @author Roel Koopman
     * @param {number} i ID of the dataset
     * @returns Z-data
     */
    getZData(i) {
        if (i < this.visualizationData.length) {
            return this.visualizationData[i].z;
        } else {
            return [[i, i + 1, i + 2], [2*i, 2*i, 2*i]] // Test data
        }
    }

        /**
     * Reorder the data
     * @author
     * @param {*} orderType Type to reorder the data into
     */
    reorder(orderType) {
        // TODO: implement
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
}
