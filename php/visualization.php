<?php
	//standaard includes en session
	session_start();
?>
<!DOCTYPE html>
<html lang="nl">
	<head>
		<title>
			Kevin's site
		</title>
		<meta charset="utf-8">
	</head>
	<body bgcolor="#87CEEB" > <!-- link="#808080" text="#000000" alink="#808080" vlink="#808080" -->
		<font color="#000000">
			<center>
				<table width = "100%" cellspacing="0">
					<tr>
						<td colspan = 2 bgcolor="#FFD700">
							<center>
								<h1>
									DBL Webtech
								</h1>
							</center>
							<table width = "100%">
								<tr>
									<td width = "15%">
										<h4>
											
										</h4>
									</td>
									<td>
										<h3>
											<center>
												
											</center>
										</h3>
									</td>
									<td width = "15%">
										
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td width  = 15%  height = 85 bgcolor= "#FF0000">
							<a href="index.html">
								<center>
									<h2>
										Home
									</h2>
								</center>
							</a>
						</td>
						<td rowspan = "9" width  = 90% valign="top" align = left>
							<div class=visulization>
								
							</div>
							<?php print($_SESSION["file_name"]);?>
						</td>
					</tr>
					<tr>
						<td width  = 10% height = 85 bgcolor= "#FF8C00">
							<a href="upload.html">
								<center>
									<h2>
										Upload data
									</h2>
								</center>
							</a>
						</td>
					</tr>
					<tr>
						<td width  = 10% height = 85 bgcolor= "#FFFF00">
							<a href="enter_code.html">
								<center>
									<h2>
										Enter code
									</h2>
								</center>
							</a>
						</td>
					</tr>
					<tr>
						<td width  = 10% height = 85 bgcolor= "#00FF7F">
							<a href="wip.html">
								Link 4
							</a>
						</td>
					</tr>
					<tr>
						<td width  = 10% height = 85 bgcolor= "#ADD8E6">
							<a href="wip.html">
								Link 5
							</a>
						</td>
					</tr>
					<tr>
						<td width  = 10% height = 85 bgcolor="#0000CD" >
							<a href="wip.html">
								Link 6
							</a>
						</td>
					</tr>
					<tr>
						<td width  = 10% height = 85 bgcolor="#663399" >
							<a href="wip.html">
								Link 7
							</a>
						</td>
					</tr>
					<tr>
						
					</tr>
					<tr>
						<td colspan = 2>
							<hr>
						</td>
					</tr>
				</table>
			</center>	
			<table width = 100% height = 20 bgcolor = #87CEEB>
				<tr bgcolor = #87CEEB>
					<td width = 20% bgcolor = #87CEEB>
						
					</td>
					<td align = middle>
						<sup>
							© TUe
						</sup>
					</td>
					<td width = 20% align = right>
						<a href="wip.html">
							<font size = 1>	<!-- 12x -->
								Credits
							</font>
						</a>
					</td>
				</tr>
			</table>
		</font>
	</body>
</html>