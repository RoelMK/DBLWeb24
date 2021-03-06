<?php
	//sessie start etc.
	include ("php/setup.inc.php");
?>
<!-- Below code was written by Jeroen Gijsbers -->
<html lang="html5">
	<head>
		<link href="css/stylesUpload.css" rel="stylesheet">
		<link href="css/help_kevin_styles.css" rel="stylesheet">
		<title>2IOA0 Group 24</title>
		<script>
        window.onload = function() {
            var tag = document.createElement("script");
            tag.src = "./js/libraries/effects.js";
            document.getElementsByTagName("head")[0].appendChild(tag);
        }
    	</script>
	</head>
	<body>
		<canvas id="canvas"></canvas>
		<div id="definition">
			<h1>Definition</h1>
			<p>To present graph visualization we must first explain what is a graph. Also called network, a graph is a collection of nodes
			(or vertices) and edges (or links). Each node represents a single data point (a person, a phone number, a transaction) and each edge
			represents how two nodes are connected (a person possess a phone number for example). This way of representing data is well suited for
			scenarios involving connections (social networks, telecommunication networks, protein interactions, and a lot more).
			</p>
			<br>
			<p>Graph visualization is the visual representation of the nodes and edges of a graph. Dedicated algorithms, called layouts,
			calculate the node positions and display the data on two (sometimes three) dimensional spaces. Graph visualization tools like Linkurious
			Enterprise provide user-friendly web interfaces to interact and explore graph data.
			</p>
		</div>
		<div id="uploadSelf">
			<h1>Upload your own file</h1>
			<form action="./php/upload_code.php" method="post" enctype="multipart/form-data">Dataset has to be in .csv format<br>
				Choose your file:
				<div class="tooltip">Help me
					<span class="tooltiptext">*insert helpfull text here*</span>
				</div>
				<br>
				<input type="file" name="fileToUpload" id="fileToUpload">
				<br>
				<?php
					print($_SESSION["upload_error"]);
					$_SESSION["upload_error"] = "";
				?>
				<br>
				
				<input type="submit" value="Upload csv file" name="submit" id="submitBtn">
			</form>
		</div>
		<div id="chooseExisting">
			<h1>Choose an existing file</h1>
			<form action="./php/upload_code.php" method="post" enctype="multipart/form-data">
				Choose one of our existing files:
				<br>
				<select name="file_select">
					<?php
						$files = glob('./uploads/*'); // get all file names
						foreach($files as $file){ // iterate files
							if(is_file($file)) {
								echo "<option value='$file'>". basename($file) . "</option>"; // print file
							}
						}
					?>
				</select>
				<br><br>
				<input type="submit" value="Start visualization" name="submit" id="submitBtn">
				<br>
			</form>
		</div>
		<div id="sharecode">
			<h1>Share code</h1>
			<form action="./php/load_share_code.php" method="post" enctype="multipart/form-data">
				Enter your share code here:
				<br>
				<input type="text" name="shareCode"><br>
				<br><br>
				<input type="submit" value="Check code" name="submit" id="submitBtn">
				<br>
			</form>
			<div id="">
				<?php
					echo $_SESSION["share_message"];
					echo "<br>";
					if(!empty($_SESSION["share_file"]) && !empty($_SESSION["share_message"])){
						echo '	<form method="post" action="php/check_share_code.php">
									<input type = "hidden" name = "confirm" value = "yes">
									<input type="submit" value="Yes" name="submit">
								</form>
								<form method="post" action="php/check_share_code.php">
									<input type = "hidden" name = "confirm" value = "no">
									<input type="submit" value="No" name="submit">
								</form>';
					}
					$_SESSION["share_message"] = "";
				?>
			</div>
		</div>

	</body>
</html>
