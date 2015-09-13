var VisualContainer;
VisualContainer = (function () {
    /**
     *
     * @param {VisualRect} visualRect
     * @param {VisualRect} [children]
     * @constructor
     */
    function VisualContainer(visualRect, children){
        VisualRect.call(this, visualRect.id, visualRect.node.className, visualRect.left, visualRect.top, visualRect.right, visualRect.bottom);
        this.children = children || [];
        this.childrenMap = {};
        for(var i = 0, child; child = this.children[i]; i++){
            this.addChild(child);
        }
        this.eventManager = null;
    }

    var containerProto = VisualContainer.prototype = Object.create(VisualRect.prototype);

    /**
     *
     * @param {EventManager} eventManager
     */
    containerProto.setEventManager = function(eventManager){
      this.eventManager = eventManager;
      this.eventManager.setContainer(this);
    };

    /**
     *
     * @param {VisualRect} child
     */
    containerProto.addChild = function (child) {
        this.node.appendChild(child.node);
        this.childrenMap[child.id] = child;
        this.children.push(child);
        if(this.eventManager){
            this.eventManager.childAddEvents(child);
        }
    };

    /**
     *
      * @param {String} id
     */
    containerProto.removeChild = function (id) {
        var child = this.getChild(id),
            index = this.children.indexOf(child),
            node = this.node,
            childNode = child.node;
        this.children.splice(index,1);
        if(node == childNode.parentNode){
            node.removeChild(child.node);
        }
        delete this.childrenMap[id];
    };

    /**
     *
     * @param {string} id
     * @returns {VisualRect}
     */
    containerProto.getChild = function(id){
        return this.childrenMap[id];
    };


    /**
     *
     * @returns {number}
     */
    containerProto.count = function () {
        return this.children.length;
    };

    containerProto.constructor = VisualContainer;

    return VisualContainer;

})();
