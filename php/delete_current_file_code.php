<?php
	include ("setup.inc.php");
	//if ($_SESSION["dcf"] == "confirm") {
		//standaard includes en session
		$path = $_SESSION["file_name"];
		
		$files = glob('../uploads/*'); // get all file names
		foreach($files as $file){ // iterate files
		  if(is_file($file))
			if($file == $path) {
				unlink($file); // delete file
			}
		}
		$locatie = "clear_session.php";
		header("location:$locatie");
	//}
?>
<!--
Are you sure you want to remove this file from the site? This will result in the share code being removed and the file will no longer be public.<br>
<a href = "delete_current_file_confirm_code.php">ja</a><br>
<a href = "matrixNodelink.php">nee</a><br>
-->
