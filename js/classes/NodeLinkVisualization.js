class NodeLinkVisualization {
  constructor(elementID, graph) {
    this.graph = graph
    this.graph.groupComponents()

    this.forcePositions = null
    this.circularPositions = null
    this.hierarchicalPositions = null
    this.currentLayout = 'force'

    this.minConnectivity = 0
    this.minComponentSize = 0
    //this.graph.positionComponents()

    this.container = document.getElementById(elementID)

    this.options = {
      nodes: {
        shape: 'dot',
        size: 10
      },
      layout: {
        improvedLayout: false
      },
      edges: {
        width: 0.15,
        color: {inherit: 'from'},
        smooth: {
          enabled: false
        }
      },
      interaction: {
        hideEdgesOnDrag: false
      },
      physics: {
        enabled: true,
        solver: 'barnesHut',
        /*barnesHut: {
          gravitationalConstant: -1000,
          springConstant: 0.1
        },*/
        stabilization: {
          enabled: false,
          iterations: 200,
          updateInterval: 10
        }
      }
    }

    // initialize your network!
    this.network = new vis.Network(
      this.container,
      {
        nodes: this.graph.nodes,
        edges: this.graph.edges
      },
      this.options
    )

    this.initForceLayout()

    this.network.on("stabilizationProgress", function(params) {
      console.log(params.iterations, params.total)
    })
  }

  setLayout(e) {
    var type = e.target.value
    // reload positions if calculated before
    if (this[type + 'Positions']) {
      this.graph.nodes.update(this[type + 'Positions'])
      return
    }

    // otherwise save current positions
    var plainPositions = this.network.getPositions()

    var update = []
    for (var id in plainPositions) {
      if (plainPositions.hasOwnProperty(id)) {
          update.push({id: id, x: plainPositions[id].x, y: plainPositions[id].y})
        }
    }

    this[this.currentLayout + 'Positions'] = update

    if (type === 'force') {
      this.initForceLayout()
    } else if (type === 'circular') {
      this.initCircularLayout()
    } else if (type === 'hierarchical') {
      this.initHierarchicalLayout()
    }
  }

  initForceLayout() {
    this.graph.groupComponents()
    this.graph.gridPosition()
  }

  initCircularLayout() {

  }

  initHierarchicalLayout() {

  }

  togglePhysics() {
    this.network.setOptions({
      physics: !this.network.physics.physicsEnabled
    })
  }

  toggleEdgeSmoothing() {
    this.network.setOptions({
      edges: {
        smooth: {
          enabled: !this.network.edgesHandler.options.smooth.enabled
        }
      }
    })
  }

  toggleEdges() {
    this.network.setOptions({
      edges: {
        hidden: !this.network.edgesHandler.options.hidden
      }
    })
  }

  // display/hide nodes based on sliders in the UI
  filterNodes() {
    var nodes = this.graph.nodes
    var nodeUpdate = []
    var edgeUpdate = []
    var vis = this
    var shouldShow = []

    // mark nodes with the required connectivity
    nodes.forEach(function(node) {
      if (node.neighbors === undefined) {
        // Do nothing
      } else if (node.neighbors.length >= vis.minConnectivity) {
        shouldShow[node.id] = true
        node.neighbors.forEach(function(childNode) {
          shouldShow[childNode.id] = true
        })
      }
    })

    // check if candidate nodes also have to right group size
    shouldShow.forEach(function(element, index) {
      if (element === true) {
        var node = nodes.get(index)
        if (node.groupSize === undefined) {
          // Do nothing
        } else if (node.groupSize < vis.minComponentSize) {
          shouldShow[index] = false
        }
      }
    })

    // do the update in one go, this is wayyy more efficient
    for (var n = 0; n < nodes.length; n++) {
      if (shouldShow[n]) {
        nodeUpdate.push({id: n, hidden: false, physics: true})
      } else {
        nodeUpdate.push({id: n, hidden: true, physics: false})
      }
    }

    nodes.update(nodeUpdate)

    // make sure that hidden edges have no effect on gravity
    var edges = this.graph.edges
    edges.forEach(function(edge) {
      if (shouldShow[edge.from] && shouldShow[edge.to]) {
        edgeUpdate.push({id: edge.id, physics: true})
      } else {
        edgeUpdate.push({id: edge.id, physics: false})
      }
    })

    edges.update(edgeUpdate)
  }

  // Accepts change event or just a value
  setMinComponentSize(e) {
    var newValue
    if (typeof e === 'number') {
      newValue = e
    } else if (e instanceof Event) {
      newValue = +e.target.value
      // change the label in the UI
      document.getElementById(e.target.id + 'value').innerHTML = newValue
    }
    this.minComponentSize = newValue
    this.filterNodes()
  }

  setMinConnectivity(e) {
    var newValue
    if (typeof e === 'number') {
      newValue = e
    } else if (e instanceof Event) {
      newValue = +e.target.value
      // change the label in the UI
      document.getElementById(e.target.id + 'value').innerHTML = newValue
    }
    this.minConnectivity = newValue
    this.filterNodes()
  }

  // see test.html for an example of how to use these.
  assignButtons(options) {
    var vis = this
    Object.keys(options).forEach(function(key) {
      var element = options[key]
      var action  = vis[key]
      element.addEventListener('click', action.bind(vis))
    })
  }

  assignSliders(options) {
    var vis = this
    Object.keys(options).forEach(function(key) {
      var element = options[key]
      var action  = vis[key]
      element.addEventListener('change', action.bind(vis))
    })
  }

  assignDropdowns(options) {
    var vis = this
    Object.keys(options).forEach(function(key) {
      var element = options[key]
      var action  = vis[key]
      element.addEventListener('change', action.bind(vis))
    })
  }
}
