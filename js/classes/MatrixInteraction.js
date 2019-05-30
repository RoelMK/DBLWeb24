class MatrixInteraction {   // https://plot.ly/javascript/plotlyjs-events/
    /**
     * 
     * @param {MatrixVisualization} visualization 
     */
    constructor(visualization) {
        this.visualization = visualization;
    }

    /**
     * Matrix click event
     * @author Roel Koopman
     * @param {Object} data Click data (https://plot.ly/javascript/click-events/)
     */
    matrixClick(data) {    
        var point = null;
        for (var i = 0; i < data.points.length; i++){
            point = {x: data.points[i].x, y: data.points[i].y}
        }
        
        if (point != null) {
            interactivity.focusEdge(point.y, point.x);  // y: from, x: to
        }
    }
    
    matrixHover(data) {    // https://plot.ly/javascript/hover-events/
    
    }
    
    matrixUnhover(data) {    // https://plot.ly/javascript/hover-events/
        
    }
    
    /**
     * Matrix zoom event
     * @author Roel Koopman
     * @param {Object} data Zoom event data (https://plot.ly/javascript/zoom-events/)
     */
    matrixZoom(data) {
        if (data['xaxis.autorange']) {  // Unfocus if autorange is going back on for the matrix
            interactivity.unfocus();
        }
    }
}