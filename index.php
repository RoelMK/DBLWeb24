<?php
	//sessie start etc.
	include ("php/setup.inc.php");
?>
<!-- Below code was written by Jeroen Gijsbers -->
<html lang="html5">
	<head>
		<link href="css/stylesIndex.css" rel="stylesheet">
		<title>2IOA0 Group 24</title>
		<?php
			$redirect = "upload.php";
			header("location:$redirect");
		?>
	</head>
	<body>
		<div id="navBar">
			<ul>
				<li><a href="index.php">Welcome!</a></li>
				<li><a href="upload.php">Visualizations</a></li>
				<li><a href="aboutUs.html">About us</a></li>
			</ul>
		</div>
		<div id="upload">
		</div>
		<div id="visBlock">
			<h1>We are currently deciding whether we want to keep a welcome page.</h1>
			<p></p>
			<a href = "help_page.php">help</a>
		</div>
	</body>
</html>
