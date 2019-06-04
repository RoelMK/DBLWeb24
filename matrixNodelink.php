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
				<li><a href="upload.php">Visualizations</a></li>
				<li><a href="aboutUs.html">About us</a></li>
			</ul>
		</div>
		<div id="upload">
			
		</div>
		<div id="controlPanel">
			<div id="">
				<?php
					if (!empty($_SESSION["file_name"])) {
						print("You are now using ");
						print(basename($_SESSION["file_name"]));
						print("<br>");
						echo "<br>";
						print("	<a href='./php/clear_session.php'>
									remove selected csv file.
								</a>");
					}
					echo "<br>";
					echo "<br>";
					if(empty($_SESSION["generated_share"])) {
							print("	<a href='./php/generate_share_code.php'>
									Generate a share code.
									</a>");
							echo "<br>";
						}
					else {
						print("You share code is " . $_SESSION["generated_share"]);
						$_SESSION["generated_share"] = "";
						echo "<br>";
					}
				?>
			</div>
		</div>
		<div id="visBlock">
			<div id="matrix">
				<?php
					if (!empty($_SESSION["file_name"])) {
						echo "	<script>
									visualizeCSVFile('./uploads/" . basename($_SESSION["file_name"]) . "', 'matrix')
								</script>";
					}
				?>
			</div>
			<div id="divider2"></div>
			<div id="nodelink"></div>
		</div>
	</body>
</html>
<!-- 
<?php 
				
			?>
-->