<?php
	$server = "localhost";
	$user = "u22907p49188_webtechUS";
	$wachtwoord = "Group24!kDjG";
	$database = "u22907p49188_webtechDB";
	$query = "";
	$result = "";
	
	$db = new mysqli($server, $user, $wachtwoord);
	mysqli_select_db($db, $database);
	
	$codetable = "filecodes";
?>