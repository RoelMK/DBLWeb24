<?php
	//standaard includes en session
	include ("setup.inc.php"); 
	include ("db_connect.inc.php");
	
	$files = glob('../uploads/*'); // get all file names
	foreach($files as $file){ // iterate files
	  if(is_file($file)) {
			echo "$file <br>"; // print file
		}
	}
	
	echo "<br> done";
?>