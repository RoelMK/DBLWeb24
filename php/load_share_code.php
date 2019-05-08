<?php
	//sessie start etc.
	include ("setup.inc.php");
	include ("db_connect.inc.php");
	
	$code = $_POST["code"];
	//check if is already shared once
	if ($stmt = $db->prepare("SELECT file_name FROM $codetable WHERE code=?")) 
	{
		// Bind a variable to the parameter as a string. 
		$stmt->bind_param("s", $code);
 
		// Execute the statement.
		$stmt->execute();
 
		// Get the variables from the query.
		$stmt->bind_result($result);
 
		// Fetch the data.
		$stmt->fetch();
		
		// Close the prepared statement.
		$stmt->close();
	}
	if($result == "") { 	
		echo "The file you look for has been deleted or the entered code is wrong.";
	}
	else {
		if (file_exists($result)) {
			$_SESSION["file_name"] = $result;
			$_SESSION["upload_error"] = "";
			
			mysqli_close($db);
			$locatie = "index.php#anchSection2";
			header("location:$locatie");
			
			echo "If you see this, please report. #2";
			$uploadOk = 0;
		}
		
		//error handling.
		
		mysqli_close($db);
		echo "The file you looked for has been deleted.";
	}
	echo "<br> From now it is empty";
?>