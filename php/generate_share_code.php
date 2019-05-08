<?php
	//sessie start etc.
	include ("setup.inc.php");
	include ("db_connect.inc.php");
	
	$file_name = $_SESSION["file_name"];
	
	//check if is already shared once
	if ($stmt = $db->prepare("SELECT code FROM $codetable WHERE file_name=?")) 
	{
		// Bind a variable to the parameter as a string. 
		$stmt->bind_param("s", $file_name);
 
		// Execute the statement.
		$stmt->execute();
 
		// Get the variables from the query.
		$stmt->bind_result($result);
 
		// Fetch the data.
		$stmt->fetch();
		
		// Close the prepared statement.
		$stmt->close();
	}
	if($result == 0) { // if not in db add new code
		$code = rand(1, 1000);
		if ($stmt = $db->prepare("INSERT INTO $codetable (file_name, code) VALUES(?, ?)")) 
		{
	 
			// Bind the variables to the parameter as strings. 
			$stmt->bind_param("si", $file_name, $code);
		 
			// Execute the statement.
			$stmt->execute();
		 
			// Close the prepared statement.
			$stmt->close();
	 
		}
		echo "New code = $code";
	}
	else {
		echo "Old code = $result";
	}
	echo "<br> From now it is empty";
	//close db
	mysqli_close($db);
?>