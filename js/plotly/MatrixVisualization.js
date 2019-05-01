class MatrixVisualization {
    /**
     * Initializes the matrix, automatically draws it.
     * @author Roel Koopman
     * @param {*} dataToVisualize Converted data by @Julian (TODO: specify input format)
     * @param {string} elementID ID of the div to display the visualization in
     */
    constructor(dataToVisualize, elementID) {
        this.baseData = this.convertDataToPlotlyData(dataToVisualize);  // Base data: the data without any reordering
        this.orderedData = this.baseData;                               // Ordered data: the data after reordering
        this.elementID = elementID;                                     // Element ID: id of the div
        this.colorType = 'Electric';                                    // Color type: type of color to use for the heatmap
        this.draw();
    }

    /**
     * Draw the matrix
     * @author Roel Koopman
     */
    draw() {
        var plotlyData = this.generatePlotlyVisualizationInput(); 
        Plotly.newPlot(this.elementID, plotlyData); // Plot using Plotly
    }

    /**
     * Reorder the data and redraw the matrix
     * @author
     * @param {*} orderType Type to reorder the data into
     */
    reorder(orderType) {
        // TODO: implement
        // use this.baseData as input (data to order)
        // use this.orderedData as output 
        this.draw();
    }

    /**
     * Change the colorscale of the matrix
     * @author Roel Koopman
     * @param {string} colorscale Name of the colorscale to use (find colorscales here: https://plot.ly/nodejs/heatmaps/)
     */
    setColor(colorscale) {
        this.colorscale = colorscale;
        this.draw();
    }

    /**
    * Prepares the input data for Plotly
    * @author Roel Koopman
    * @returns Input for Plotly
    */
    generatePlotlyVisualizationInput() {
        return [
            {
                z: this.orderedData,
                colorscale: this.colorscale,
                type: 'heatmap'
            }
        ]
    }
  
    /**
    * Converts data from @Julian into usuable data for Plotly.
    * @author
    * @param {*} dataToConvert Data from @Julian  TODO: what is the data type of the input data going to be?
    * @returns Converted data
    */
    convertDataToPlotlyData(dataToConvert) {
        return dataToConvert;   // TODO: implement conversion
    }
}