class MatrixVisualization {
    /**
     * Initializes the matrix, automatically draws it.
     * @author Roel Koopman
     * @param {Matrix} dataToVisualize Converted unordered data
     * @param {string} elementID ID of the div to display the visualization in
     */
    constructor(dataToVisualize, elementID) {
        this.plot = document.getElementById(elementID);         // Plot
        this.visualizationData = [                              // visualizationData[i] -- contains data for matrix visualization
            dataToVisualize.asPlotly(),                         // i=0: Base data
            //dataToVisualize.optimalLeafOrder().asPlotly()     // i=1: Optimal leaf order
            //dataToVisualize.barycenterOrder().asPlotly()      // i=2: Bary center order
            //dataToVisualize.sortOrder().asPlotly()            // i=3: Sort order
            //dataToVisualize.pcaOrder().asPlotly()             // i=4: PCA order
        ];  
        this.draw();    // Draw the matrix
    }

    /**
     * Draw the matrix
     * @author Roel Koopman
     */
    draw() {       
        Plotly.newPlot(this.plot, this.generateData(), this.generateLayout());
        this.setInteraction();
    }

    /**
     * Generate the layout of the visualization
     * @author Roel Koopman
     * @returns Layout (for plotly)
     */
    generateLayout() {
        return {
            title: 'Adjacency Matrix',
            annotations: [],
            xaxis: {
              ticks: '',
              tickfont: {
                size: 8
                }
            },
            yaxis: {
              ticks: '',
              side: 'right', 
              tickfont: {
                  size: 8
              }
            },
            updatemenus: [
            {   // Menu 1: color
                xanchor: 'left',
                yanchor: 'top',
                y: 1.1,
                x: 0,
                buttons: [{
                   method: 'restyle',
                    args: ['colorscale', 'Blackbody'],
                    label: 'Blackbody'
                }, {
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
                }, {
                    method: 'restyle',
                    args: ['colorscale', 'Earth'],
                    label: 'Earth'
                }, {
                    method: 'restyle',
                    args: ['colorscale', 'Bluered'],
                    label: 'Bluered'
                }, {
                    method: 'restyle',
                    args: ['colorscale', 'Portland'],
                    label: 'Portland'
                }, {
                    method: 'restyle',
                    args: ['colorscale', 'Picnic'],
                    label: 'Picnic'
                }, {
                    method: 'restyle',
                    args: ['colorscale', 'Jet'],
                    label: 'Jet'
                }, {
                    method: 'restyle',
                    args: ['colorscale', 'Hot'],
                    label: 'Hot'
                }]
            }, {    // Menu 2: data set
                xanchor: 'left',
                yanchor: 'top',
                y: 1.1,
                x: 0.24,
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
                    label: 'Bary center order'
                }, {
                    method: 'restyle',
                    args: ['visible', [false, false, false, true, false]],
                    label: 'Sort order'
                }, {
                    method: 'restyle',
                    args: ['visible', [false, false, false, false, true]],
                    label: 'PCA order'
                }]
            }]
        }
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
            return {
                z: this.visualizationData[i].z,
                x: this.visualizationData[i].x,
                y: this.visualizationData[i].y,
            };
        } else {
            return {
                z: [[i, i + 1, i + 2], [2*i, 2*i, 2*i]] // Dummy data
            };  
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
