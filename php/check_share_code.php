<?php
	//sessie start etc.
	include ("setup.inc.php");
	
	$confirm = $_POST["confirm"];
	if ($confirm == "yes"){
		$_SESSION["file_name"] = $_SESSION["share_file"];
		$_SESSION["share_file"] = "";
		
		$locatie = "../matrixNodelink.php";
		header("location:$locatie");
	}
	if ($confirm == "no"){
		$_SESSION["share_file"] = "";
		
		$locatie = "../upload.php";
		header("location:$locatie");
	}
	echo "damn";
?>