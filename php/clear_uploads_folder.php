<?php
	//standaard includes en session
	include ("setup.inc.php"); 
	
	$files = glob('Uploads/*'); // get all file names
	foreach($files as $file){ // iterate files
	  if(is_file($file))
		unlink($file); // delete file
	}
	
	$locatie = "../index.php";
	header("location:$locatie");
?>