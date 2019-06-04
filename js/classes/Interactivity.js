class Interactivity {
    /**
     * Focus on an edge
     * @param {String} edgeTail Name of the tail node of the edge
     * @param {String} edgeHead Name of the head node of the edge
     */
    focusEdge(edgeTail, edgeHead) {
        if (chord != null) chord.focus(edgeTail);
        if (matrix != null) matrix.focusEdge(edgeTail, edgeHead);
        // if (nodeLink != null) nodeLink.focusEdge(edgeTail, edgeHead);
    }

    /**
     * Focus on a node
     * @param {String} node Name of the node
     */
    focusNode(node) {
        if (chord != null) chord.focus(node);
        if (matrix != null) matrix.focusNode(node);
        // if (nodeLink != null) nodeLink.focusNode(node);
    }

    /**
     * Unfocus
     */
    unfocus() {
        if (chord != null) chord.unfocus();
        if (matrix != null) matrix.unfocus();
        // if (nodeLink != null) nodeLink.unfocus();
    }


    /*highlightEdge(edgeTail, edgeHead) {

    }

    highlightNode(node) {
        
    }

    unhighlight() {

    }*/ // TODO

    /**
     * Change the color scheme of the matrix
     * @param {String} color Name of new color scheme
     */
    changeColorOfMatrix(color) {
        if (matrix != null) matrix.changeColor(color);
    }

    /**
     * Change the order of the data in the matrix
     * @param {String} order New order to use (base/barycenter/optimalleaf/sort/pca)
     */
    changeOrderOfMatrix(order) {
        if (matrix != null) matrix.changeOrder(order);
    }
}