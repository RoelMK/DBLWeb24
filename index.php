<?php
	//sessie start etc.
	include ("php/setup.inc.php");
?>

<!-- Below code was written by Jeroen Gijsbers -->
<html lang="html5">
	<head>
		<link href="css/styles.css" rel="stylesheet">
		<title>2IOA0 Group 24</title>

		<!-- Script stuff -->
		<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
		<script src="./js/libraries/science.v1.js"></script> <!-- reorder.js dependency -->
		<script src="./js/libraries/tiny-queue.js"></script> <!-- reorder.js dependency -->
		<script src="./js/libraries/reorder.v1.js"></script>

		<script src="./js/methods/CSVtoJSON.js"></script>

 		<script src="./js/classes/Matrix.js">               </script>
 		<script src="./js/classes/MatrixVisualization.js">  </script>
 		<script src="./js/classes/MatrixInteraction.js">    </script>
		<script src="./js/classes/NodeLinkVisualization.js"></script>
	</head>


	<body>
		<!-- The navigation bar will make use of so called anchors, which are scattered within the code, but are always accompanied with a comment. -->
		<div id="nav_block">
		<ul id="nav">
			<li><a href="#anchorVis1">The visualisations</a></li>
			<li><a href="#anchorAboutus">About us</a></li>
		</ul>
		</div>
		<img class="backgrImage" src="images/complexNetwork.jpg" alt="A visualization of a complex social network">
		<div id="profile_block">
			<h2>Group 24</h2>
			<p> Welcome to the somewhat improved website of group 24 of the 2IOA0 course. </p>
		</div>

	<!-- START OF VISUALIZATIONS AND UPLOAD -->
	<!-- from now on, everything will have a padding of 100px. I will therefore wrap it in a div. -->
		<a id="anchorVis1"></a> <!-- Anchor for the "Visualization" section -->
		<div id="secondSection">
			<div id="vis1">
				<h1> Visualizations!</h1>
				<form action="php/upload_code.php" method="post" enctype="multipart/form-data">Select file to upload: <br>
				<input type="file" name="fileToUpload" id="fileToUpload"> <br>
				<input type="submit" value="Upload csv file" name="submit">
				</form>
				<?php
					print($_SESSION["upload_error"]);
					print("<br>");
					if (!empty($_SESSION["file_name"])) {
						print("You are now using ");
						print($_SESSION["file_name"]);
						print("<br>");
						print("	<a href='php/clear_session.php'>
									remove selected csv file.
								</a>");
					}
					$_SESSION["upload_error"] = "";
				?>
				<div id="canvas"></div>
			</div>
		</div>
		<a id="anchorAboutus"></a> <!-- Anchor for the "About us" section -->
		<div id="thirdSection">
			<h1> About us </h1>
			<p> We are group 24 of the DBL Webtech visualization project. Our team consists of the following people: </p>
			<ul>
				<li>Matthijs Bosch</li>
				<li>Kevin Dirksen</li>
				<li>Jeroen Gijsbers</li>
				<li>Roel Koopman</li>
				<li>Jarno Ottens</li>
				<li>Julian Vink</li>
			</ul>
		</div>
		<!-- This goes at the end of body, to ensure the entire page has loaded. -->
		<script src="./js/main.js"></script>
	</body>
</html>
