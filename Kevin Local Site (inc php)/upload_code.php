<?php
	//sessie start etc.
	include ("setup.inc.php");

	$target_dir = "Uploads/";
	$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
	$uploadOk = 1;
	$fileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	
	
	// Allow certain file formats and no empty's
	if($fileType != "csv") {
		$_SESSION["upload_error"] = "Please upload a csv file";
		$locatie = "index.php#anchorVis1";
		header("location:$locatie");
		
		echo "If you see this, please report. #1";
		$uploadOk = 0;
	}

	// Check if file already exists
	else if (file_exists($target_file)) {
		$_SESSION["file_name"] = $target_file;
		$_SESSION["upload_error"] = "";
		$locatie = "index.php#anchorVis1";
		header("location:$locatie");
		
		echo "If you see this, please report. #2";
		$uploadOk = 0;
	}
	
	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
		$locatie = "index.php#anchorVis1";
		header("location:$locatie");
		
		echo "If you see this, please report. #3";
	// if everything is ok, try to upload file
	} else {
		if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
			$_SESSION["file_name"] = $target_file;
			$_SESSION["upload_error"] = "";
			$locatie = "index.php#anchorVis1";
			header("location:$locatie");
			
			echo "If you see this, please report. #4";		
			
		} else {
			$_SESSION["upload_error"] = "Sorry, there was an error uploading your file. Please try again. If this keeps happening, please report this.";
			$locatie = "index.php#anchorVis1";
			header("location:$locatie");
			
			echo "If you see this, please report. #5";
		}
	}

?>