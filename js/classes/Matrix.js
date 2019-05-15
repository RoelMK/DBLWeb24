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
    return this
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
    return this
  }

  /**
   * Fill the matrix with random data that would make sense when visualized
   * as a graph.
   * @author Jarno
   * @param  {Number} size
   */
  randomizeGraph(size = 10) {
    var data = []
    for (var x = 0; x < size; x++) {
      data[x] = []
      for (var y = 0; y < size; y++) {
        if (x == y) {
          data[x].push(0)
        } else {
          data[x].push(Math.random() < 0.9 ? 0 : 1)
        }
      }
    }
    this.setData(data)
    return this
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
    return this
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
      headLabels.push('Node ' + y.toString())
    }
    this.setTailLabels(tailLabels)
    this.setHeadLabels(headLabels)
    return this
  }

  /**
   * Specify the names of the destination/head nodes. Note that these may be
   * different from the tail labels as a result of reordering.
   * @author Jarno
   * @param {string[]} labels
   */
  setHeadLabels(labels) {
    this.headLabels = labels.slice() // Pass by copy, not reference.
    return this
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

  asVis() {
    console.log(JSON.stringify(this.tailLabels))
    console.log(JSON.stringify(this.headLabels))
    if (JSON.stringify(this.tailLabels) != JSON.stringify(this.headLabels)) {
      throw new Error("can't do this yet!")
    }

    var visData = {
      nodes: [],
      edges: []
    }

    for (var tailIndex = 0; tailIndex < this.data.length; tailIndex++) {
      visData.nodes.push({
        id: tailIndex,
        label: this.tailLabels[tailIndex]
      })
    }

    for (var tailIndex = 0; tailIndex < this.data.length; tailIndex++) {
      for (var headIndex = 0; headIndex < this.data[0].length; headIndex++) {
        if (this.data[tailIndex][headIndex] == 0) continue
        visData.edges.push({
          from: tailIndex,
          to: headIndex,
          arrows: 'to'
        })
      }
    }

    visData.nodes = new vis.DataSet(visData.nodes)
    visData.edges = new vis.DataSet(visData.edges)
    return visData
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
   */
  permute(permutation) {
    var clone = this.clone()
    clone.data = reorder.permute(clone.data, permutation)
    clone.setTailLabels(
      reorder.permute(clone.tailLabels, permutation)
    )
    clone.setHeadLabels(
      reorder.permute(clone.headLabels, permutation)
    )
    return clone
  }

  /**
   * Use the reorder library to sort by optimal leaf order.
   * @author Jarno
   * @return {Matrix} Reordered clone.
   */
  optimalLeafOrder() {
    var permutation = reorder.optimal_leaf_order()(this.data)
    return this.permute(permutation)
  }
}
