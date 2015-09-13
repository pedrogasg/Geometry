var DragHandler;
DragHandler = (function(){
    function DragHandler(service){
        this.change = function(){};
        this.dragEvent = false;
        this.containerNode = null;
        this.container = null;
        this.currenHandler = null;
        this.count = 0;
        this.service = service;
        this.eventManager = null;
    }

    var draggerProto = DragHandler.prototype,
        LIMITATOR = 5,
        CLASSNAME = 'handler';

    draggerProto.setEventManager = function (eventManager) {
        this.eventManager = eventManager;
    };

    /**
     *
     * @param {VisualRect} child
     */
    draggerProto.childAddEvents = function(child){
        var node = child.node
        if(!child.handler){
            var handler = child.handler = document.createElement('div');
            handler.className = CLASSNAME;
            handler.appendChild(document.createTextNode(this.container.count()));
            node.appendChild(handler);
            child.handler = new Handler(child.id);
            child.handler.addElement(handler);

        }
        node.draggable = true;
        node.addEventListener('dragstart' , this.handleDragStart.bind(this), false);
        child.handler.setNewCallback('mousedown', this.handleMouseDownInHandler.bind(this));
    };

    /**
     *
     * @param {VisualContainer} container
     */
    draggerProto.setContainer = function(container){
        this.container = container;
        this.containerNode = container.node;
        this.containerNode.draggable = false;
        this.containerNode.addEventListener('dragover' , this.handleDragOver.bind(this), false);
        this.containerNode.addEventListener('drop' , this.handleDrop.bind(this));
        this.containerNode.addEventListener('mouseout' , this.handleMouseOut.bind(this), false);
        for(var i = 0,child; child = container.children[i];i++){
            this.childAddEvents(child);
        }
    };

    /**
     *
     * @param {MouseEvent} e
     */
    draggerProto.handleMouseDownInHandler = function (e) {
        this.currenHandler = e.target;
    };

    /**
     *
     * @param {MouseEvent} e
     */
    draggerProto.handleDragStart = function (e) {
        var id = e.target.id,
            child = this.container.getChild(id);
        if(child && child.handler.contains(this.currenHandler)){
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text', id);
            this.dragEvent = true;
            this.change = this.stateChanger(child, e.pageX, e.pageY);
            this.service.memento(child);

        }else{
            e.preventDefault();
        }
    };

    /**
     *
     * @param {MouseEvent} e
     */
    draggerProto.handleDragOver = function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if(this.dragEvent){
            if(this.count++ % LIMITATOR == 0){
                this.service.computeLayoutMove(this.change(e.pageX, e.pageY));
            }
        }
        return false;
    };

    /**
     *
     * @param {MouseEvent} e
     */
    draggerProto.handleDragEnter = function (e) {
        if(e.target == this.containerNode) {
            this.dragEvent = true;
        }
    };

    /**
     *
     * @param {MouseEvent} e
     */
    draggerProto.handleDrop = function (e) {
        e.preventDefault();
        if(this.dragEvent) {
            this.currenHandler = null;
            this.dragEvent = false;
            this.service.safeState();
        }
    };


    draggerProto.handleMouseOut = function () {
        if(this.dragEvent){
            this.currenHandler = null;
            this.service.safeState();
        }
    };

    /**
     *
     * @param {VisualRect} child
     * @param {number} x
     * @param {number} y
     * @returns {Function}
     */
    draggerProto.stateChanger = function (child, x, y) {
        var id = child.id,
            startX = child.left - x,
            startY = child.top - y,
            height = child.height,
            width = child.width;
        return function(x$, y$){
            var deltaX = x$ + startX,
                deltaY = y$ + startY;
            return {
                id:id,
                left:deltaX,
                top:deltaY,
                right:deltaX + width,
                bottom:deltaY + height
            };
            //child.setPosition(deltaX, deltaY, deltaX + width, deltaY + height);
        }
    };

    return DragHandler;
})();