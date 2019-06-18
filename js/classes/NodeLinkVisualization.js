class NodeLinkVisualization {
  constructor(elementID) {
    this.nodes = new vis.DataSet()
    this.edges = new vis.DataSet()

    this.directed = false

    this.forcePositions = null
    this.circularPositions = null
    this.hierarchicalPositions = null
    this.currentLayout = 'force'

    this.minConnectivity = 0
    this.minComponentSize = 0

    this.container = document.getElementById(elementID)

    this.options = {
      nodes: {
        shape: 'dot',
        size: 10 // this is the radius
      },
      layout: {
        improvedLayout: false
      },
      edges: {
        width: 0.15,
        color: {inherit: 'from'},
        smooth: {
          enabled: false
        },
        selectionWidth: function (width) {return width * 2}
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
  }

  // used to communicate with matrix
  assignInteractivity(interactivity) {
    nodeLink = this

    this.network.on('selectNode', function(e) {
      interactivity.focusNode(nodeLink.nodes.get(e.nodes[0]).label, {nodeLink: true})
    })

    this.network.on('selectEdge', function(e) {
      var edgeID    = e.edges[0]
      var edge      = nodeLink.edges.get(edgeID)
      var fromLabel = nodeLink.nodes.get(edge.from).label
      var toLabel   = nodeLink.nodes.get(edge.to).label

      interactivity.focusEdge(fromLabel, toLabel, {nodeLink: true})
    })

    this.network.on('click', function(e) {
      if (e.nodes.length === 0 && e.edges.length === 0) {
        interactivity.unfocus()
      }
    })
  }

  // this step is done after reading the CSV to drastically improve performance
  setupNetwork() {
    this.network = new vis.Network(
      this.container,
      {
        nodes: this.nodes,
        edges: this.edges
      },
      this.options
    )

    this.groupComponents()
    this.initForceLayout()
  }

  // automatically detect whether the graph is directed. This is required
  // before reading the csv!!
  detectDirected(matrixData) {
    var columnCutoff = 1 // to prevent looking at diagonals or double checks

    // outer loops goes through rows
    for (var row = 0; row < matrixData.length - 1; row++) {
      // inner loops goes through columns
      for (var column = 0; column < matrixData.length - columnCutoff; column++) {
        var value         = matrixData[row][column]
        var inverseRow    = matrixData.length - 1 - column
        var inverseColumn = matrixData.length - 1 - row
        var inverseValue  = matrixData[inverseRow][inverseColumn]
        if (value !== inverseValue) {
          this.directed = true
          return
        }
      }
      columnCutoff++
    }
    this.directed = false
  }

  // here be dragons
  readCSV(csvString) {
    csvString = csvString.replace(/\r\n/g, '\n')
    var index = 0
    var id    = 0
    var substring = ''
    if (csvString[0] === ';') index = 1

    // add the nodes
    for (; index < csvString.length; index++) {
      var char = csvString[index]

      if (char === ';' || char === '\n') {
        this.nodes.add({
          id: id,
          label: substring,
          neighbors: [],
          group: null
        })
        if (char === '\n') {
          index++
          break
        } else {
          id++
          substring = ''
        }
      } else {
        substring = substring + char
      }
    }

    // add the edges
    var originID = 0
    var targetID = 0
    var substring = ''
    for (; index < csvString.length; index++) {
      var char = csvString[index]

      if (char === ';' || char === '\n') {
        if (/[a-zA-Z]/.test(substring)) {
          // if the thing has letters, ignore it
        } else {
          var weight = +substring
          if (weight !== 0) {
            var edge = {
              id: originID + '-' + targetID,
              from: originID,
              to: targetID,
              value: weight
            }
            if (!this.directed && originID < targetID) {
              edge.hidden = true
              edge.physics = false
            } else {
              edge.arrows = {
                to: {
                  enabled: true,
                  scaleFactor: 0.5
                }
              }
            }
            this.edges.add(edge)
            this.nodes.get(originID).neighbors.push(this.nodes.get(targetID))
          }
          targetID++
        }
        substring = ''
        if (char === '\n') {
          originID++
          targetID = 0
        }
      } else {
        substring = substring + char
      }
    }

    this.groupComponents()
    this.setupNetwork()
  }

  // assign distinct groups to nodes that are in different components
  groupComponents() {
    var visited = {}
    var group = 0
    var groupCount = []
    var lastGroupAdded = 0
    var graph = this
    var groupUpdate = []

    function visitNode(node) {
      if (!visited[node.id]) {
        visited[node.id] = true
        groupUpdate.push({id: node.id, group: group})
        if (groupCount[group] === undefined) {
          groupCount[group] = 1
        } else {
          groupCount[group]++
        }
        lastGroupAdded = group
        node.neighbors.forEach(function(neighbor) {
          visitNode(neighbor)
        })
      }
    }

    for (var n = 0; n < this.nodes.length; n++) {
      var node = graph.nodes.get(n)
      visitNode(node)
      group = lastGroupAdded + 1
    }

    this.nodes.update(groupUpdate)
    var groupCountUpdate = []

    for (var n = 0; n < this.nodes.length; n++) {
      var node = graph.nodes.get(n)
      groupCountUpdate.push({id: node.id, groupSize: groupCount[node.group]})
    }

    graph.nodes.update(groupCountUpdate)
  }

  // utility function that returns groups of nodes
  getGroups() {
    var groups = []
    this.nodes.forEach(function(node) {
      if (groups[node.group] === undefined) {
        groups[node.group] = [node]
      } else {
        groups[node.group].push(node)
      }
    })
    groups.sort(function(a, b) {
      return (a.length < b.length)
    })
    return groups
  }

  // returns array of nodes where adjacent entries are in the same group
  // used by circular layout
  getGroupsAsArray() {
    var groups = this.getGroups()
    var arr = []
    groups.forEach((group) => {
      group.forEach((node) => {
        arr.push(node)
      })
    })
    return arr
  }

  // gets passed an event from the dropdown box, changes the layout
  setLayout(e) {
    var type = e.target.value
    this.currentLayout = type
    /* MIGHT BE FIXED LATER
    // reload positions if calculated before
    if (this[type + 'Positions']) {
      this.nodes.update(this[type + 'Positions'])
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
    this.currentLayout = type
    */

    if (type === 'force') {
      this.initForceLayout()
    } else if (type === 'circular') {
      this.initCircularLayout()
    } else if (type === 'hierarchical') {
      this.initHierarchicalLayout()
    }

    this.fitToScreen()
  }

  // these calulate initial positions for each layout
  // force layout is initially put in a gridlike layout to speed up stabilization
  initForceLayout() {
    var groups = this.getGroups()

    function calculatePositions() {
        var positions = []
        var n = 0
        while (positions.length < groups.length * 2) {
          walkAroundCenter(n, positions)
          n++
        }
        return positions
    }

    function walkAroundCenter(n, positions) {
      if (n === 0) {
        positions.push(0, 0)
        return
      }
      var x = n
      var y = n
      for (var i = 0; i < n * 2; i++) {
        positions.push(x, y)
        x--
      }
      for (var i = 0; i < n * 2; i++) {
        positions.push(x, y)
        y--
      }
      for (var i = 0; i < n * 2; i++) {
        positions.push(x, y)
        x++
      }
      for (var i = 0; i < n * 2; i++) {
        positions.push(x, y)
        y++
      }
    }

    var positions = calculatePositions()

    this.network.setOptions({layout: {hierarchical: false}})

    var graph = this
    var update = []
    this.nodes.forEach(function(node) {
      var groupX = positions[node.group * 2]
      var groupY = positions[node.group * 2 + 1]
      update.push({
        id: node.id,
        x: groupX * 300,
        y: groupY * 300
      })
    })
    graph.nodes.update(update)
    this.togglePhysics(true)
  }

  initCircularLayout() {
    this.togglePhysics(false)
    this.network.setOptions({layout: {hierarchical: false}})
    var circleRadius = this.nodes.length * 10
    var nodeUpdate = []
    var grouped = this.getGroupsAsArray()
    for (var i = 0; i < this.nodes.length; i++) {
      var rad = i / this.nodes.length * Math.PI * 2
      var random = 1 + Math.random() / 100
      var x   = Math.cos(rad) * circleRadius * random
      var y   = Math.sin(rad) * circleRadius * random
      nodeUpdate.push({id: grouped[i].id, x: x, y: y})
    }
    this.nodes.update(nodeUpdate)
  }

  initHierarchicalLayout() {
    this.network.setOptions({
      layout: {
        hierarchical: {
          direction: "UD",
          sortMethod: "directed",
          treeSpacing: 10,
          nodeSpacing: 10
        },
      }
    })
    this.togglePhysics(true)
  }

  // these just adjust global settings
  togglePhysics(boolean) {
    if (typeof boolean === 'boolean') {
      this.network.setOptions({
        physics: boolean
      })
    } else {
      this.network.setOptions({
        physics: !this.network.physics.physicsEnabled
      })
    }
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

  fitToScreen() {
    this.network.fit()
  }

  // display/hide nodes based on sliders in the UI
  filterNodes() {
    var nodes = this.nodes
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
    var edges = this.edges
    edges.forEach(function(edge) {
      if (shouldShow[edge.from] && shouldShow[edge.to]) {
        edgeUpdate.push({id: edge.id, physics: true})
      } else {
        edgeUpdate.push({id: edge.id, physics: false})
      }
    })

    edges.update(edgeUpdate)
  }

  // accepts change event or just a value
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

  findNode(name) {
    var nodesFound = this.nodes.get({
      filter: function(node) {
        return node.label === name
      }
    })
    if (nodesFound) {
      return nodesFound[0]
    } else {
      return null
    }
  }

  focusEdge(edgeTail, edgeHead) {
    var tailNode = this.findNode(edgeTail)
    var headNode = this.findNode(edgeHead)
    if (tailNode != null && headNode != null) {
      this.network.focus(tailNode.id, {animation: true})
      this.network.selectEdges([tailNode.id + '-' + headNode.id])
    }
  }

  focusNode(node) {
    if (typeof node === 'string') {
      node = this.findNode(node)
    }
    if (node != null) {
      this.network.focus(node.id, {animation: true})
      this.network.selectNodes([node.id])
    }
  }

  unfocus() {
    this.fitToScreen()
    this.network.selectNodes([])
  }
}
