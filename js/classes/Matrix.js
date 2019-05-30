/**
 * This class represents the data used for the matrix vizualization. It keeps
 * track of weights, but also the names of the given nodes.
 *
 * TODO: accept JSON as input.
 *
 * @author Jarno & ...
 * @property {number[][]} this.data
 * @property {string[]} this.tailLabels
 * @property {string[]} this.headLabels
 */
class Matrix {
  constructor() {
    this.data = null
    this.tailLabels = null
    this.headLabels = null
    // Nothing to see here. Setters are given as methods and not parameters,
    // which makes documentation easier.
  }

  /**
   * Specify the weights of the matrix. The data is given as an array of arrays.
   * Weights can be indexed as follows: this.data[tail][head].
   * @param {number[][]} data
   */
  setData(data) {
    // The following makes a deep copy of the 2d array.
    this.data = []
    for (var x = 0; x < data.length; x++) {
      this.data.push(data[x].slice())
    }

    // Set some default labels, we always assume they are defined.
    this.setDefaultLabels()
  }

  /**
   * Fill the matrix with random data of size 10x10 for debug purposes.
   * @author Jarno
   * @param {number} size - Dimensions of the matrix.
   */
  randomize(size = 10) {
    var data = []
    for (var x = 0; x < size; x++) {
      data[x] = []
      for (var y = 0; y < size; y++) {
        data[x].push(Math.random())
      }
    }
    this.setData(data)
  }

  /**
   * Return the smallest weight in the data.
   * @author Jarno
   * @return {number} Value of smallest weight.
   */
  getMinWeight() {
    return Math.min(...this.data)
  }

  /**
   * Return the largest weight in the data.
   * @author Jarno
   * @return {number} Value of largest weight.
   */
  getMaxWeight() {
    return Math.max(...this.data)
  }

  /**
   * Specify the names of the origin/source nodes. Note that these may be
   * different from the head labels as a result of reordering.
   * @author Jarno
   * @param {string[]} labels
   */
  setTailLabels(labels) {
    this.tailLabels = labels.slice() // Pass by copy, not reference.
  }

  /**
   * Generate and set default labels in case they are not provided. Set the
   * data first before calling this, since the dimensions need to be known.
   * @author Jarno
   */
  setDefaultLabels() {
    var tailLabels = []
    var headLabels = []
    for (var x = 0; x < this.data.length; x++) {
      tailLabels.push('Node ' + x.toString())
    }
    for (var y = 0; y < this.data[0].length; y++) {
      headLabels.push('Node' + y.toString())
    }
    this.setTailLabels(tailLabels)
    this.setHeadLabels(headLabels)
  }

  /**
   * Specify the names of the destination/head nodes. Note that these may be
   * different from the tail labels as a result of reordering.
   * @author Jarno
   * @param {string[]} labels
   */
  setHeadLabels(labels) {
    this.headLabels = labels.slice() // Pass by copy, not reference.
  }

  /**
   * Return a representation of the matrix that's accepted by plotly.
   * @author Jarno
   * @return {Object}
   */
  asPlotly() {
    return {
      z: this.data,
      x: this.headLabels,
      y: this.tailLabels,
      type: 'heatmap'
    }
  }

  /**
   * Return a deep clone of this object. Don't forget to update this method as
   * more properties are added to Matrix!
   * @author Jarno
   * @return {Matrix}
   */
  clone() {
    var clone = new Matrix()
    clone.setData(this.data)             // This is safe, since these methods
    clone.setTailLabels(this.tailLabels) // clone the parameter anyway.
    clone.setHeadLabels(this.headLabels)
    return clone
  }

  /**
   * Reorder the data and labels based on a given permutation. This gets
   * calculated by functions like this.optimalLeafOrder
   * @param  {number[]} permutation
   * @return {Matrix} - A reordered clone of this matrix.
   *///permute only switches rows not columns thus the label switching isn't correct
  permute(permutation) {
    var clone = this.clone()
    clone.data = reorder.permute(clone.data, permutation)
    clone.setTailLabels(
      reorder.permute(clone.tailLabels, permutation)
    )
    /*clone.setHeadLabels(
      reorder.permute(clone.headLabels, permutation)
    )*///commented out as it isn't correct in this version
    return clone
  }

  /**
   * Use the reorder library to sort by optimal leaf order.
   * @author Jarno & Matthijs
   * @param {'single', 'average', 'complete'} type of linkage (default parameter given should be complete)
   * @param {euclidean, manhattan, chebyshev, hamming, jaccard, braycurtis} distance type (optional if no parameter is given euclidean distance is used)
   * @return {Matrix} Reordered clone.
   * linkage should be tested on further datasets to give different results
   */
  optimalLeafOrder(linkage_type, distance_name) {
	var distance_type = reorder.distance.euclidean;				//set distance type to euclidean by default
	//update the distance type if it is specified
	if(distance_name == "manhattan"){distance_type = reorder.distance.manhattan;}
	if(distance_name == "chebyshev"){distance_type = reorder.distance.chebyshev;}
	if(distance_name == "hamming"){distance_type = reorder.distance.hamming;}
	if(distance_name == "jaccard"){distance_type = reorder.distance.jaccard;}
	if(distance_name == "braycurtis"){distance_type = reorder.distance.braycurtis;}
	//end of potentially updating distance	
    var permutation = reorder.optimal_leaf_order().linkage(linkage_type).distance(distance_type)(this.data)
    return this.permute(permutation)
  }
  
  /**
   * Use the reorder library to sort by sort order.
   * @author Matthijs
   * @return {Matrix} Reordered clone.
   */
  sortOrder() {
	    var permutation = reorder.sort_order(this.data)			//compute permutation
	    return this.permute(permutation)						//apply permutation and return the result
	  }	
  
  /**
   * Use the reorder library to sort by principal component analysis.
   * @author Matthijs
   * @return {Matrix} Reordered clone.
   * perhaps only rows should be permuted 
   */
  pcaOrder() {
	  	var eps = 1e-9;											//eps is the approximation factor in computing the eigenvector
	    var permutation = reorder.pca_order(this.data,eps)		//compute permutation
	    //start permute
	    var clone = this.clone()
	    clone.data = reorder.permute(clone.data, permutation)			//apply permutation on rows
	    clone.setTailLabels(											//row labels
	      reorder.permute(clone.tailLabels, permutation)
	    )
	    
	      clone.setHeadLabels(											//column labels
	      reorder.permute(clone.headLabels, permutation)
	    )
	    clone.data = reorder.permutetranspose(clone.data, permutation)	//apply permutation on columns (added to the source of permute)
	    return clone
	    //end permute						//apply permutation and return the result
	  }	
  
  /**
   * Use the reorder library to sort by barycenter order.
   * @author Matthijs
   * @return {Matrix} Reordered clone.
   */
  barycenterOrder() {
	  	var graph = reorder.mat2graph(this.data, 1);
	  	var comps = graph.components();
	    var permutation = reorder.barycenter_order(graph, comps)	    //compute permutation
	    //start permute
	    var clone = this.clone()
	    clone.data = reorder.permute(clone.data, permutation[0])			//apply permutation on rows
	    clone.setTailLabels(											//row labels
	      reorder.permute(clone.tailLabels, permutation[0])
	    )
	    
	      clone.setHeadLabels(											//column labels
	      reorder.permute(clone.headLabels, permutation[1])
	    )
	    clone.data = reorder.permutetranspose(clone.data, permutation[1])	//apply permutation on columns (added to the source of permute)
	    return clone
	    //end permute						
	  }
  
  
  /**
   * Sort by topological order using a depth-first search algorithm as found on wikipedia (https://en.wikipedia.org/wiki/Topological_sorting).
   * @author Matthijs
   * @return {Matrix} Reordered clone.
   */
  topologicalOrder() {
	    var permutation = [];						//initiate permutation
	    var data = this.data;
	    var m_length = this.data.length;			// contains matrix length
	    var to_visit = m_length; 					// counts how many nodes still have to be visited
	    var node_to_visit = 0;						// the location in marks of the node to visit
	    var nodes = [];								// the array containing the status of each node 0 = permanently marked, 1= temporary marked, 2 = no mark
	    var marks = [];								// the array containing nodes that haven't been marked yet
	    for (var x = 0; x < m_length; x++) {		//this for loop gives values to marks and nodes
	    	marks = marks.concat(x);
	    	nodes = nodes.concat(2);
	    }
	    while (to_visit > 0){
	    	node_to_visit = Math.floor(Math.random() * to_visit);	// set node_to_visit to a random value in the range of the unmarked nodes
	    	visit(marks[node_to_visit], this.data)					// visits a node that doesn't have a marker yet
	    }
	    //visits node n
	    function visit(n){
	      	if (nodes[n] == 0){return};
	      	if (nodes[n] == 1){
	      		console.log("this graph isn't a dag, topological sort only works with dags") //throw some sort of error
	      		return								//quit
	      	}; 
	      	nodes[n] = 1; 							//mark with a temporary mark
	      	marks.splice(n, 1)						//remove node n from marks
	      	to_visit--;								//remove the amount of nodes that need to be visited
	      	for (var y = 0; y < m_length; y++){
	      		if (data[n][y] > 0){visit(y, data)}
	      	}
	      	nodes[n] = 0;							//mark with a permanent mark instead of a temporary one
	      	permutation.unshift(n);					//insert n into the front of the permutation list
	      }
	    //end algorithm
	    //start permute
	    var clone = this.clone()
	    clone.data = reorder.permute(clone.data, permutation)			//apply permutation on rows
	    clone.setTailLabels(											//row labels
	      reorder.permute(clone.tailLabels, permutation)
	    )
	    
	      clone.setHeadLabels(											//column labels
	      reorder.permute(clone.headLabels, permutation)
	    )
	    clone.data = reorder.permutetranspose(clone.data, permutation)	//apply permutation on columns (added to the source of permute)
	    return clone
	    //end permute
	  }	
  
  /**
   * Use the reorder library to sort by hierarchical clustering without optimal leaf order.
   * @author Matthijs
   * @param {'single', 'average', 'complete'} type of linkage
   * @param {euclidean, manhattan, chebyshev, hamming, jaccard, braycurtis} distance type (optional if no parameter is given euclidean distance is used) 
   * @return {Matrix} Reordered clone.
   */
  hierarchicalOrder(linkage_type, distance_name){
	  var permutation = []; 										//initiate permutation
	  var distance_type = reorder.distance.euclidean;				//set distance type to euclidean by default
	  //update the distance type if it is specified
	  if(distance_name == "manhattan"){distance_type = reorder.distance.manhattan;}
	  if(distance_name == "chebyshev"){distance_type = reorder.distance.chebyshev;}
	  if(distance_name == "hamming"){distance_type = reorder.distance.hamming;}
	  if(distance_name == "jaccard"){distance_type = reorder.distance.jaccard;}
	  if(distance_name == "braycurtis"){distance_type = reorder.distance.braycurtis;}
	  //end of potentially updating distance
	  var hcluster = science.stats.hcluster().linkage(linkage_type).distanceMatrix((reorder.dist().distance(distance_type))(this.data));	//set hcluster with input linkage and distancematrix, with distance matrix having input distance and a matrix
	  var dendrogram = hcluster(this.data);							//initiate the dendrogram and set it's value
	  //DFS walk through dendrogram
	  var to_visit = [];											//contains the parts of hte dendrogram that need to be visited
	  var visiting;													//contains the part of the dendrogram we are currently visiting
	  to_visit.push(dendrogram);									//start with visiting the entire dendrogram
	  //start walk
	  while(to_visit[0] != null){
		visiting = to_visit[0];										//visit the part of the dendrogram
		to_visit.shift();											//remove the part of the dendrogram from to_visit as it no longer needs to be visited
	  	if(visiting.depth > 0){										//check if it not a leaf
		  	if(visiting.left != null){								//check if it has a left child
			  to_visit.unshift(visiting.left);						//add the left child at the front
		  	}
		  	if(visiting.right != null){								//check if it has a right child
			  to_visit.unshift(visiting.right);						//add the right child at the front
		  	}
	  	} else {
		  	permutation.push(visiting.id);							//add the id to permutation	
	  	}
	  	
	  }
	  //end walk
	  return this.permute(permutation)
  }
  
  
}
