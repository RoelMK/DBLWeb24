<?php
	//standaard includes en session
	include ("setup.inc.php"); 
	
	session_unset();
	session_destroy();
	
	$locatie = "index.php#anchorVis1";;
	header("location:$locatie");
?>