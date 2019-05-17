class ChordVisualization {
    /**
     * Initializes the chord, automatically draws it.
     * @author Roel Koopman
     * @param {Chord} dataToVisualize Data to visualize in the chord
     * @param {string} elementID ID of the div to display the visualization in
     */
    constructor(dataToVisualize, elementID) {
        this.elementID = elementID;
        this.data = dataToVisualize.data;

        // Draw
        this.draw();
    }

    /**
     * Draw the chord diagram
     * @author Roel Koopman
     */
    draw() {
        // Get width height of div
        var width = document.getElementById(this.elementID).offsetWidth;
        var height = document.getElementById(this.elementID).offsetHeight;
        var smallestWidthHeight = Math.min(width, height);
        
        // Generate the chord
        var chord = viz.chord()
            .data(this.data)    // Set the data
            .chordOpacity(0.5)  // Opacity of the edges
            .labelPadding(1)    // Where the labels are displayed in the diagram 
            .label(function(d) {if (d.value > 0) {return d.source} else {return ""}})   // Only display relevant labels
            .duration(0)        // Animation duration (keep 0, otherwise lot of lag)
            .innerRadius(Math.round(smallestWidthHeight / 3) - 10)   // Inner radius of chord diagram 400
            .outerRadius(Math.round(smallestWidthHeight / 3));   // Outer radius of chord diagram
        
        // Set html for the svg and draw
        document.getElementById(this.elementID).innerHTML = chord_style + "<svg width=\"" + width + "\" height=\"" + height + "\"><g transform=\"translate(" + Math.round(width / 2) + "," + Math.round(height / 2) + ")\"></g></svg>"
        d3.select("g").call(chord); // Draw in svg using D3
    }
}

// CSS for chord diagram
const chord_style = `<style scoped>
body {
    font: 10px sans-serif;
}       
svg text{
    fill:black;
    font-size:10px;
}
svg .values text{
    pointer-events:none;
    stroke-width: 0.5px;
}
.groups:hover{
    cursor:pointer;
    font-weight:bold;
}
</style>`