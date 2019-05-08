class MatrixVisualization {
    /**
     * Initializes the matrix, automatically draws it.
     * @author Roel Koopman
     * @param {Matrix} dataToVisualize Converted unordered data
     * @param {string} elementID ID of the div to display the visualization in
     */
    constructor(dataToVisualize, elementID) {
        this.plot = document.getElementById(elementID);         // Plot

        // visualizationData[i] -- contains data for matrix visualization
        this.visualizationData = [
            dataToVisualize.asPlotly(),                         // i=0: base data
            //dataToVisualize.optimalLeafOrder().asPlotly()       // i=1: optimal leaf order
        ];  
        // i=2: TODO
        // i=3: TODO
        // i=4: TODO
        // i=5: TODO

        this.draw();    // Draw the matrix
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
     * @returns Menus (for plotly)
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
                label: 'Base data' 
            }, {
                method: 'restyle',
                args: ['visible', [false, true, false, false, false]],
                label: 'Optimal leaf order'
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
        for (var i = 0; i < 5; i++) {       // 5 data sets (every ordering, see definition in comment in the constructor)
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
            visible: i === 0,       // Display data for default (i=0)
            colorscale: 'Electric', // Default
            name: 'Data set ' + i,
            type: 'heatmap',
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
            return {
                z: this.visualizationData[i].z,
                x: this.visualizationData[i].x,
                y: this.visualizationData[i].y,
            };
        } else {
            return {
                z: [[i, i + 1, i + 2], [2*i, 2*i, 2*i]],
                x: [1, 2],
                y: [1, 2, 3],
            };  // Test data
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
}
