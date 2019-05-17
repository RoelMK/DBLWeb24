class CSVData {
    /**
     * CSV data constructor
     * @author Roel Koopman
     * @param {string} csv CSV file
     */
    constructor(csv) {
        this.rows = csv.split("\n");    // .replace(/[^0-9a-z,_.;\n]/gi, '')  (not (yet) required)
        this.columns = this.rows[0].split(";");
        this.rows.shift();  // Remove first row (= column names)
        this.rows.pop();    // For some reason split adds 1 extra element, remove it
        this.columns.shift();   // Remove first column (= empty)

        // Rename duplicates in columns (Plotly doesn't like duplicates!)
        for (var i = 0; i < this.columns.length; i++) {
            for (var j = i; j < this.columns.length; j++) {
                if (i != j && this.columns[i] == this.columns[j]) {
                    this.columns[j] = this.columns[j] + ' ';    // Work around to remove the duplicate
                }
            }
        }
    }

    /**
     * Get matrix from CSV
     * @author Roel Koopman
     * @returns {Matrix} Generated matrix
     */
    getMatrix() {
        var z = []; // Z-data for matrix

        for (var i = this.rows.length - 1; i >= 0; i--) {
            var currentRow = this.rows[i].split(";");
            currentRow.shift(); // Remove first item (= label)
            currentRow.pop();   // For some reason split adds 1 extra element, remove it
            currentRow = currentRow.map(Number);
            z.push(currentRow);
        }

        var matrix = new Matrix(); 
        matrix.setData(z);                  // Data is in the z-array
        matrix.setTailLabels(this.columns.reverse()); // Head and tail are the same in the default unordered dataset
        matrix.setHeadLabels(this.columns.reverse());
        return matrix;
    }

    /**
     * Get chord data from CSV
     * @author Roel Koopman
     * @returns Chord data, summarized
     */
    getChord() { 
        var z = []; // Z-data for matrix

        for (var i = 0; i < this.rows.length; i++) {
            var currentRow = this.rows[i].split(";");
            currentRow.shift(); // Remove first item (= label)
            currentRow.pop();   // For some reason split adds 1 extra element, remove it
            currentRow = currentRow.map(Number);
            z.push(currentRow);
        }

        return getSummarizedChord(this.columns, z, 25); // Generate the chord data using the z-data and the column data
    }
}