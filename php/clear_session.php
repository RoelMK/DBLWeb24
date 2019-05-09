<?php
	//standaard includes en session
	include ("setup.inc.php"); 

	session_unset();
	session_destroy();

	$locatie = "../index.php#anchSection2";;
	header("location:$locatie");
?>
