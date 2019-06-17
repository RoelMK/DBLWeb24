<?php
	//sessie start etc.
	include ("setup.inc.php"); 

	$target_dir = "../uploads/";
	$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
	$uploadOk = 1;
	$fileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	
	//count files in uploads folder
	$filecount = 0;
	$file_list = glob($target_dir . "*");
	if ($files){
	 $filecount = count($files);
	}
	
	//check if you come from file selector
	if(!empty($_POST["file_select"])) {
		$target_file = "." . $_POST["file_select"];
		$fileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	}
	
	
	if ($filecount >= 20) {
		$_SESSION["upload_error"] = "Server is full, plz try again later.";
		$locatie = "../upload.php";
		header("location:$locatie");
		
		echo "If you see this, please report. #7";
		$uploadOk = 0;
	}
	
	// Allow certain file formats and no empty's
	else if($fileType != "csv") {
		$_SESSION["upload_error"] = "File was not a .csv file.";
		$locatie = "../upload.php";
		header("location:$locatie");
		
		echo "If you see this, please report. #1";
		$uploadOk = 0;
	}
	else if ($_FILES["fileToUpload"]["size"] > 50000000) { //max 50.000 kb
		$_SESSION["upload_error"] = "File was too large, max file size is 50 kb";
		$locatie = "../upload.php";
		header("location:$locatie");
		
		echo "If you see this, please report. #8";
		$uploadOk = 0;
	}

	// Check if file already exists
	else if (file_exists($target_file)) {
		$_SESSION["file_name"] = $target_file;
		$_SESSION["upload_error"] = "";
		$locatie = "../matrixNodelink.php";
		header("location:$locatie");
		
		echo "If you see this, please report. #2";
		$uploadOk = 0;
	}
	
	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
		$locatie = "../matrixNodelink.php";
		header("location:$locatie");
		
		echo "If you see this, please report. #3";
	// if everything is ok, try to upload file
	} else {
		if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
			$_SESSION["file_name"] = $target_file;
			$_SESSION["upload_error"] = "";
			$locatie = "../matrixNodelink.php";
			header("location:$locatie");
			
			echo "If you see this, please report. #4";		
			
		} else {
			$_SESSION["upload_error"] = "Sorry, there was an error uploading your file. Please try again. If this keeps happening, please report this. #6";
			$locatie = "../upload.php";
			header("location:$locatie");
			
			echo "If you see this, please report. #5";
		}
	}

?>