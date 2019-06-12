### How to run the development server.

Clone the repo using ```git clone https://github.com/RoelMK/DBLWeb24.git```. Enter the directory with ```cd DBLWeb24```, and then run the development server using ```php -S localhost:8000```. You can now view the site in your browser by navigating to http://localhost:8000.

_Make sure you have php installed. If you can't access it from the command line, add the installation folder to your PATH environment variable._

### How to use the site

You can find our site online at: http://group24webtech.nl/. To visualize a CSV file, you selected a file under "Choose and existing file" and press "Start visualisation" or you enter a share code and press "Check code". If you chose to do the later and the file exists the website will give you the name the share code refers to and ask you if you want to load it, press yes to visualize the file. After you have a visualization you can select several options on the right panel. For the matrix we have to following options: select the algorithms and what parameters you want to use them with for matrix reordering and the colour scheme for the matrix reordering. For the node link diagram we have the following options: the layout; options to hide components based on connectivity and size; making the node link diagram fit the screen; toggling the physics; toggling the edges and toggling the edge smoothing. We have no options for the chord. _Note: if the uploaded matrix is large, the slower reorder algorithms may be too slow to be actually useable in practice._
