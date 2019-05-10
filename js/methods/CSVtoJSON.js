/**
 * the following program converts a CSV file (the variable csv) into the JSON format
 * @author Julian Vink
 * @param {text file} csv 
 */
function CSVtoJSON(csv) {
	// first we split the csv file into seperate rows, then we split the first row into an array of all keys.
	var rows = csv.split("\n");
	var allKeys = rows[0].split(",");
	var jsonFile = [];
	// now we make a for loop add a new object to the variable jsonFile, once for every connection.
	for (var i = 1; i < rows.length; i++) {
		var newObject = {};
		var currentRow = rows[i].split(",");
		for (var j = 0; j < allKeys.length; j++) {
			newObject[allKeys[j]] = currentRow[j];
		}
		jsonFile.push(newObject);
	}
	// Finally we stringify the variable jsonFile to get our result.
	return JSON.stringify(jsonFile);
}	

/**
 * NOT USED (but please keep it)
 * @param {string} csv CSV file
 */
function CSVtoCompactAdjacencyMatrixJSON(csv) {
	// First we split the csv file into seperate rows, then we split the first row into an array of all keys.
	var rows = csv.split("\n");
	var allKeys = rows[0].split(";");
	var json = {};

	// Now we make a for loop add a new object to the variable json, once for every connection.
	for (var i = 1; i < rows.length; i++) {
		var currentRow = rows[i].split(";");	// Split current row
		var heads = [];							
		
		for (var j = 1; j < currentRow.length; j++) {	// Find the heads
			if (currentRow[j] > 0) {					// Only save targets with weight > 0 (all others not saved to save space)
				heads.push({head: allKeys[j], weight: currentRow[j]});	// Push to array
			}
		}
		// Push tail and head info to json
		json[currentRow[0]] = heads;
	}

	// Finally we return the result.
	return json;
}