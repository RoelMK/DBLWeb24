<?php
	//standaard includes en session
	include ("setup.inc.php"); 
	
	session_unset();
	session_destroy();
	
	$locatie = "../upload.php";
	header("location:$locatie");
?>