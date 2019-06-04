<?php
	//sessie start etc.
	include ("setup.inc.php");
	include ("db_connect.inc.php");
	
	$code = $_POST["shareCode"];
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
		$_SESSION["share_message"] = "The code you entered was incorrect or the corresponding file has been deleted.";
		$_SESSION["share_file"] = "";
		
		mysqli_close($db);
		$locatie = "../upload.php";
		header("location:$locatie");
	}
	else {
		if (file_exists($result)) {
			$_SESSION["share_message"] = "Do you want to load ". basename($result) . "?";
			$_SESSION["share_file"] = $result;
			$_SESSION["upload_error"] = "";
			
			mysqli_close($db);
			$locatie = "../upload.php";
			header("location:$locatie");
			
			echo "If you see this, please report. #2";
			$uploadOk = 0;
		}
		else {
			$_SESSION["share_message"] = "The file you are looking for has been deleted.";
			$_SESSION["share_file"] = "";
			
			mysqli_close($db);
			$locatie = "../upload.php";
			header("location:$locatie");
		}
		//error handling.
		
		
		echo "The file you looked for has been deleted.";
	}
	echo "<br> From now it is empty";
?>