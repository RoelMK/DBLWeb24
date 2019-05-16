<?php
	include ("setup.inc.php"); 
	include ("db_connect.inc.php");
	
	if ($stmt = $db->prepare("DELETE FROM $codetable")) 
	{
		// Bind the variable to the parameter as a string. 
		//$stmt->bind_param("s", $incidentsoort);
	 
		// Execute the statement.
		$stmt->execute();
	 
		// Close the prepared statement.
		$stmt->close();
	}
	//close db
	mysqli_close($db);
	echo "all share codes cleared.";
?>