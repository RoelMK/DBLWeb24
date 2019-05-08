class CSVData {
    /**
     * CSV data constructor
     * @param {string} csv CSV file
     */
    constructor(csv) {
        this.rows = csv.split("\n");
        this.columns = this.rows[0].split(";");
        this.rows.shift();  // Remove first row (= column names)
        this.rows.pop();    // For some reason always add 1 extra element, remove it
        this.columns.shift();   // Remove first column (= empty)
    }

    /**
     * Get matrix from CSV
     * @returns {Matrix} Generated matrix
     */
    getMatrix() {
        var z = []; // Z-data for matrix

        for (var i = this.rows.length - 1; i >= 0; i--) {
            var currentRow = this.rows[i].split(";");
            currentRow.shift(); // Remove first item (= label)
            currentRow.pop();   // For some reason always add 1 extra element, remove it
            z.push(currentRow);
        }

        var matrix = new Matrix(); 
        matrix.setData(z);                  // Data is in the z-array
        matrix.setTailLabels(this.columns); // Head and tail are the same in the default unordered dataset
        matrix.setHeadLabels(this.columns);
        return matrix;
    }
}