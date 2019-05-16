<?php
	//sessie start etc.
	include ("setup.inc.php");
	include ("db_connect.inc.php");
	
	$query = "SELECT * FROM $codetable";
	$result = mysqli_query($db, $query); // query uitvoeren
	mysqli_close($db);
	
	while(list($file_name, $code) = mysqli_fetch_row($result))
	{
		echo "$file_name : $code <br>";
	}
	
	echo "<br> From now it is empty";
?>