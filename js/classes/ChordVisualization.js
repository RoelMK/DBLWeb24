class ChordVisualization {
    /**
     * Initializes the chord, automatically draws it.
     * @author Roel Koopman
     * @param {Chord} dataToVisualize Data to visualize in the chord
     * @param {string} elementID ID of the div to display the visualization in
     */
    constructor(dataToVisualize, elementID) {
        this.elementID = elementID;
        this.mainChord = dataToVisualize
        this.focusChord = null;

        // Draw
        this.draw(this.mainChord.data);
    }

    /**
     * Draw the chord diagram
     * @param {Array} chordData Array of chord data
     * @author Roel Koopman
     */
    draw(chordData) {
        // Get width height of div
        var width = document.getElementById(this.elementID).offsetWidth;
        var height = document.getElementById(this.elementID).offsetHeight;
        var smallestWidthHeight = Math.min(width, height);

        // Generate the chord
        var chord = viz.ch()
            .data(chordData)    // Set the data
            .chordOpacity(0.5)  // Opacity of the edges
            .padding(.01)
            .duration(0)        // Animation duration (keep 0, otherwise lot of lag)
            .innerRadius(Math.round(smallestWidthHeight / 3) - 20)   // Inner radius of chord diagram 400
            .outerRadius(Math.round(smallestWidthHeight / 3))   // Outer radius of chord diagram
            //.sort(function(a,b){return d3.ascending(a.value, b.value)});
            .fill(function(d) { return intToRGB(hashCode(d)); });
        
        // Set html for the svg and draw
        document.getElementById(this.elementID).innerHTML = chord_style + "<svg width=\"" + width + "\" height=\"" + height + "\"><g transform=\"translate(" + Math.round(width / 2) + "," + Math.round(height / 2) + ")\"></g></svg>"
        d3.select("g").call(chord);
    }

    /**
     * Focus on a node
     * @param {String} node Node to focus on
     */
    focus(node) {     
        this.focusChord = this.mainChord.getFocusData(node, 100); // TODO: 100 is a magic number
        this.draw(this.focusChord.data); 
    }

    /**
     * Restore chord diagram: unfocus
     */
    unfocus() {
        this.focusChord = null;
        this.draw(this.mainChord.data);
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

/**
 * Convert a string into a hash
 * @param {String} str String to get hash code for
 * @returns Hash code of string
 */
function hashCode(str) { 
    if(str == undefined) {
        return 0;   // Undefined -> Return 0
    }

    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

/**
 * Convert a number into a color
 * @param {Number} i Number to generate a color for
 * @returns Generated color
 */
function intToRGB(i){
    var c = (i & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}