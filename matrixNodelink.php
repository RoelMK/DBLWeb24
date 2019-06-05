<?php
	//sessie start etc.
	include ("php/setup.inc.php");
?>
<!-- Below code was written by Jeroen Gijsbers -->
<html lang="html5">
	<head>
		<link href="css/styles.css" rel="stylesheet">
		<title>2IOA0 Group 24</title>

		<script src="./php/jquery-3.3.1.js"></script>
		<link rel="stylesheet" type="text/css" href="./css/dropdown_kevin.css">
		
		
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
									Return to upload page.
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
					
					echo "<br>";
					print("	<a href='./php/delete_current_file_code.php'>
									Remove current file from site.
							</a>");
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
				<br>
				<br>
				<form method="post" action="output.php" name="reorderForm">
					<select style="color:black" name = "algorithm" id="selector3">
						<option value="def" style="color:black">Select a reorder algorithm</option>
						<option value="Bary" style="color:black">Barycenter</option>
						<option value="PCA" style="color:black">PCA</option>
						<option value="Topo" style="color:black">Topological sort</option>
						<option value="Hier" style="color:black">Hierarchical clustering</option>
						<option value="Opt" style="color:black">Optimal leaf order</option>
					</select>
					<br>
					<br>
					<div class="Bary s3">
						No parameters needed.
					</div>
					<div class="PCA s3">
						Permutation variables: 
						<select name = "PCA permutation" style="color:black">
							<option value="0" style="color:black">Rows only</option>
							<option value="1" style="color:black">Columns only</option>
							<option value="2" style="color:black">Both rows and columns</option>
						</select>
					</div>
					<div class="Topo s3">
						Permutation variables: 
						<select name = "Topo permutation" style="color:black">
							<option value="0" style="color:black">Rows only</option>
							<option value="1" style="color:black">Columns only</option>
							<option value="2" style="color:black">Both rows and columns</option>
						</select>
					</div>
					<div class="Hier s3">
						Permutation variables: 
						<select name = "Hier permutation" style="color:black">
							<option value="0" style="color:black">Rows only</option>
							<option value="1" style="color:black">Columns only</option>
							<option value="2" style="color:black">Both rows and columns</option>
						</select>
						<br>
						<br>
						Link type: 
						<select name = "Hier link" style="color:black">
							<option value="single" style="color:black">Single</option>
							<option value="average" style="color:black">Average</option>
							<option value="complete" style="color:black">Complete</option>
						</select>
						<br>
						<br>
						Distance type: 
						<select name = "Hier distance" style="color:black">
							<option value="euclidean" style="color:black">Euclidean</option>
							<option value="manhattan" style="color:black">Manhattan</option>
							<option value="chebyshev" style="color:black">Chebyshev</option>
							<option value="hamming" style="color:black">Hamming</option>
							<option value="jaccard" style="color:black">Jaccard</option>
							<option value="braycurtis" style="color:black">Braycurtis</option>
						</select>
					</div>
					<div class="Opt s3">
						Permutation variables: 
						<select name = "Opt permutation" style="color:black">
							<option value="0" style="color:black">Rows only</option>
							<option value="1" style="color:black">Columns only</option>
							<option value="2" style="color:black">Both rows and columns</option>
						</select>
						<br>
						<br>
						Link type: 
						<select name = "Opt link" style="color:black">
							<option value="single" style="color:black">Single</option>
							<option value="average" style="color:black">Average</option>
							<option value="complete" style="color:black">Complete</option>
						</select>
						<br>
						<br>
						Distance type: 
						<select name = "Opt distance" style="color:black">
							<option value="euclidean" style="color:black">Euclidean</option>
							<option value="manhattan" style="color:black">Manhattan</option>
							<option value="chebyshev" style="color:black">Chebyshev</option>
							<option value="hamming" style="color:black">Hamming</option>
							<option value="jaccard" style="color:black">Jaccard</option>
							<option value="braycurtis" style="color:black">Braycurtis</option>
						</select>
					</div>
					<br>
					<center><input type='submit' class = "s3 Bary PCA Topo Hier Opt" value = 'Apply algorithm' style="color:black"></center>
				</form>
				<script> 
					$('#selector3').on('change',function()
					{
						var divClass = $(this).val();
						$(".s3").hide();
						$("."+divClass).slideDown('medium');
						
					});
				</script>
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
