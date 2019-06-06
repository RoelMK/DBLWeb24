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
    <script src="./js/classes/ChordVisualization.js"></script>
    <script src="./js/classes/Chord.js"></script>
    <script src="./js/classes/Interactivity.js"></script>
    <script src="./js/main.js"></script>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
		<script src="./js/libraries/viz.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js"></script>
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
				<button id='button1'>Toggle Physics</button>
				<button id='button2'>Toggle Edge Smoothing</button>
				<button id='button3'>Toggle Edges</button>
				<button id='button4'>Fit to Screen</button>
				<input type='range' id='slider1' min='0' max='10' value='0'></input>
				<!-- TODO: set min and max value from the NodeLinkVisualization-->
				<label>Min. component size: <span id='slider1value'>0</span></label>
				<input type='range' id='slider2' min='0' max='10' value='0'>
				<label>Min. connectivity: <span id='slider2value'>0</span></label>
				<select id='select1'>
					<option value="force">Force-Directed</option>
					<option value="circular">Circular</option>
					<option value="hierarchical">Hierarchical</option>
				</select>
			</div>
		</div>
		<div id="visBlock">
			<div id="matrix">
				<?php
					if (!empty($_SESSION["file_name"])) {
						echo "	<script>
									visualizeCSVFile('./uploads/" . basename($_SESSION["file_name"]) . "', 'matrix', 'matrix')
								</script>";
					}
				?>
			</div>
			<div id="divider2"></div>
			<div id="nodelink">
			<?php
					if (!empty($_SESSION["file_name"])) {
						echo "	<script>
									visualizeCSVFile('./uploads/" . basename($_SESSION["file_name"]) . "', 'nodelink', 'nodelink')
								</script>";
					}
				?>
			</div>
		</div>
	</body>
</html>
<!--
<?php

			?>
-->
