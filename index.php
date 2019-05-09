<?php
	//sessie start etc.
	include ("php/setup.inc.php"); 
?>

<!-- Below code was written by Jeroen Gijsbers -->
<html lang="html5">
	<head>
		<link href="styles.css" rel="stylesheet">
		<title>2IOA0 Group 24</title>

		<!-- Script stuff -->
		<script src="./js/libraries/pixi.js"></script>
 		<script src="./js/libraries/pixi-viewport.js"></script>
 		<script src="./js/libraries/tinycolor.js"></script>
 		<script src="./js/libraries/tinygradient.js"></script>

 		<script src="./js/classes/AdjacencyMatrix.js"></script>
 		<script src="./js/classes/Visualization.js"></script>
 		<script src="./js/classes/MatrixVisualization.js"></script>
	</head>
	<body>
		<div id="firstSection">
			<ul id="nav">
				<li><a href="#anchSection2">The visualisations</a></li>
				<li><a href="#anchSection3">About us</a></li>
			</ul>
			<img id="video" src="images/insertVideo.jpg" alt="This is a video">
			<div id="textSection">
				<p class="overflowText">From left to right, we have:</p>
				<ul>
					<li>Kevin Dirksen (Website back-end)</li>
					<li>Roel Koopman (Visualisation specialist)</li>
					<li>Jarno Ottens (Visualisation specialist)</li>
					<li>Jeroen Gijsbers (Website front-end)</li>
					<li>Julian Vink (Data Transformation)</li>
					<li>Matthijs Bosch (Reorder Specialist)</li>
				</ul>
				<p class="overflowText"> When I now keep adding text here, the image will shift continually downwards, creating bigger and bigger sections</p>
			</div>
		</div>
		<div id="secondSection">
			<a id="anchSection2"></a> <!-- Anchor for the "Visualization" section -->
			<h1>Visualizations</h1>
			<p id="textSect2">This text will explain a bit about these visualisations</p>
			<img src="images/screenshot.jpg" id="imgSect2" alt="This is a preview of the visualisation you are about to see">
			<form action="php/upload_code.php" method="post" enctype="multipart/form-data">Select file to upload: <br> 
				<input type="file" name="fileToUpload" id="fileToUpload">
				<input type="submit" value="Upload csv file" name="submit">
			</form>
			<!-- PHP done by Kevin Dirksen -->
			<div id="PHPResult">
			<?php 
				print($_SESSION["upload_error"]);
				print("<br>");
				if (!empty($_SESSION["file_name"])) {
					print("You are now using ");
					print($_SESSION["file_name"]);
					print("<br>");
					//print("	<a href='clear_session.php'>
								//remove selected csv file.
							//</a>");
				}
				$_SESSION["upload_error"] = "";
			?>
			</div>
			<a href="/subpages/test.html" id="btnToVis">Go to the visualisation</a>
			<!-- Start of Jeroen Gijsbers' part again -->
		</div>
		<div id="thirdSection">
			<a id="anchSection3"></a> <!-- Anchor for the "About us" section -->
			<h1> About us </h1>
			<p> We are group 24 of the DBL Webtech visualization project. Our team consists of the following people: </p>
			<ul>
				<li><a href="People/MBosch.html">Matthijs Bosch</a></li>
				<li><a href="People/KDirksen.html">Kevin Dirksen</a></li>
				<li><a href="People/JGijsbers.html">Jeroen Gijsbers</a></li>
				<li><a href="People/RKoopman.html">Roel Koopman</a></li>
				<li><a href="People/JOttens.html">Jarno Ottens</a></li>
				<li><a href="People/JVink.html">Julian Vink</a></li>
			</ul>
			Kevin's link list (to be implemented on different places)<br>
			<a href = "php/clear_uploads_folder.php"> clear uploads folder </a> For later use <br>
			<a href = "php/generate_share_code.php"> generate share code </a> For later use   <br>
			<a href = "php/generate_share_code.php"> generate share code </a> For later use   <br>
			<form action="php/load_share_code.php" method="post">Enter share code: <br> <!-- kevins work -->
				<input type="text" name="code"> <br>
				<input type="submit" value="Enter the code" name="submit">
			</form>
		</div>
	</body>
</html>