<?php
	//sessie start etc.
	include ("php/setup.inc.php"); 
?>
<!-- Below code was written by Jeroen Gijsbers -->
<html lang="html5">
	<head>
		<link href="css/stylesUpload.css" rel="stylesheet">
		<title>2IOA0 Group 24</title>
	</head>
	<body>
		<div id="navBar">
			<ul>
				<li><a href="index.php">Welcome!</a></li>
				<li><a href="upload.php">Visualizations</a></li>
				<li><a href="aboutUs.html">About us</a></li>
			</ul>
		</div>
		<div id="definition">
			<ul>
			  <li><a href = "help_page.php?help=HtU">How to upload</a></li>
			  <li><a href = "help_page.php?help=Matrix">Matrix</a></li>
			  <li><a href = "help_page.php?help=NL">Node-link</a></li>
			  <li><a href = "help_page.php?help=FAQ">FAQ</a></li>
			</ul>
		</div>
		<div id="uploadSelf">
			<?php
				if($_GET["help"] == "HtU") {
					include ("php/help_text/HtU.inc.php"); 
				}
				if($_GET["help"] == "Matrix") {
					include ("php/help_text/Matrix.inc.php"); 
				}
				if($_GET["help"] == "NL") {
					include ("php/help_text/NL.inc.php"); 
				}
				if($_GET["help"] == "FAQ") {
					include ("php/help_text/FAQ.inc.php"); 
				}
				if($_GET["help"] == "") {
					//include ("php/help_text/WiP.inc.php");
					echo "Press a link.";
				}
				//https://www.w3schools.com/howto/howto_css_tooltip.asp
			?>
		</div>
	</body>
</html>