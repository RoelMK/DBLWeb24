<!-- Below code was written by Jeroen Gijsbers -->
<?php
	//sessie start etc.
	include ("setup.inc.php"); 
?>
<html lang="html5">
	<head>
		<link href="styles.css" rel="stylesheet">
		<title>2IOA0 Group 24</title>

		<!-- Script stuff -->
		<script src="./js/libraries/science.v1.js"></script> <!-- reorder.js dependency -->
		<script src="./js/libraries/tiny-queue.js"></script> <!-- reorder.js dependency -->
		<script src="./js/libraries/reorder.v1.js"></script>

		<script src="./js/methods/CSVtoJSON.js"></script>

        <script src="./js/classes/CSVData.js">               </script>
 		<script src="./js/classes/Matrix.js">               </script>
 		<script src="./js/classes/MatrixVisualization.js">  </script>
 		<script src="./js/classes/MatrixInteraction.js">    </script>
        <script src="./js/classes/NodeLinkVisualization.js"></script>
		<script src="./js/main.js"></script>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
	</head>
	<body>
		<div id="navBar">
			<ul>
				<li><em><a href="index.php">Welcome!</a></em></li>
				<li><a href="matrixNodelink.php">Matrix and Nodelink</a></li>
				<li><a href="aboutUs.html">About us</a></li>
			</ul>
		</div>
		<div id="upload">
			<form action="upload_code.php" method="post" enctype="multipart/form-data">Select file to upload: <br> 
				<input type="file" name="fileToUpload" id="fileToUpload">
				<input type="submit" value="Upload csv file" name="submit" id="submitBtn">
			</form>
			<?php 
				print($_SESSION["upload_error"]);
				print("<br>");
				if (!empty($_SESSION["file_name"])) {
					print("You are now using ");
					print($_SESSION["file_name"]);
					print("<br>");
					print("	<a href='clear_session.php'>
								remove selected csv file.
							</a>");
				}
				$_SESSION["upload_error"] = "";
			?>
		</div>
		<div id="controlPanel"></div>
		<div id="visBlock">
			<div id="matrix">
				<?php
					if (!empty($_SESSION["file_name"])) {
						echo "	<script>
									visualizeCSVFile('./././" . $_SESSION["file_name"] . "', 'matrix')
								</script>";
					}
				?>
			</div>
			<div id="divider2"></div>
			<div id="nodelink"></div>


		</div>
	</body>
</html>