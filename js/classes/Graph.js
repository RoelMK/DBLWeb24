class Graph {
  constructor() {
    this.nodes = new vis.DataSet()
    this.edges = new vis.DataSet()
    this.directed = false
  }

  setDirected(boolean) {
    this.directed = boolean
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
    return this
  }

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

  gridPosition() {
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
  }
}
