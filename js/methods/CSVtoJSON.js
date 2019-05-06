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