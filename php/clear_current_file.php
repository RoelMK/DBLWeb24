<?php
	//standaard includes en session
	include ("setup.inc.php"); 
	$path = $_SESSION["file_name"];
	$files = glob('Uploads/*'); // get all file names
	foreach($files as $file){ // iterate files
	  if(is_file($file))
		if($file == $path) {
			unlink($file); // delete file
		}
	}
	
	$locatie = "clear_session.php";
	header("location:$locatie");
?>