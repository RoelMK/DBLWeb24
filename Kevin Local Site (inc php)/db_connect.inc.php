<?php
	$server = "localhost";
	$user = "root";
	$wachtwoord = "root";
	$database = "webtech";
	$query = "";
	$result = "";
	
	$db = new mysqli($server, $user, $wachtwoord);
	mysqli_select_db($db, $database);
	
	$codetable = "filecodes";
?>