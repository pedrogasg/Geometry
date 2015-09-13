var VisualSweeperService;
VisualSweeperService = (function(){
    var CONTAINER_CLASS = 'visual-container',
        RECT_CLASS = 'visual-rect',
        CONTAINER_SUFFIX = 'container-',
        RECT_SUFFIX = '-childrect-';

    /**
     * @param {string} id
     * @param {number} left
     * @param {number} top
     * @param {number} right
     * @param {number} bottom
     * @param {HTMLElement} parent
     */
    function VisualSweeperService(id, left, top, right, bottom, parent){
        this.id = id;
        this.container = new VisualContainer(new VisualRect(CONTAINER_SUFFIX + this.id, CONTAINER_CLASS, left, top, right, bottom));
        this.margin = 6;
        parent.appendChild(this.container.node);
        this.eventManager = new EventManager(new DragHandler(this),new ResizeHandler(this), new CoordinatorHandler(this));
        this.container.setEventManager(this.eventManager);
        this.proxy = new VisualWorker(this);
        //this.proxy = new VisualToGeoProxy(this);
        this.proxy.setMargin(this.margin);
        this.proxy.setContainer(this.container);
        this.errors = [];
    }

    var visualProto = VisualSweeperService.prototype;

    /**
     * @param {number} left
     * @param {number} top
     * @param {number} right
     * @param {number} bottom
     */
    visualProto.addChild = function(left, top, right, bottom){
        var child = new VisualRect(this.id + RECT_SUFFIX + this.container.count(), RECT_CLASS, left, top, right, bottom);
        this.container.addChild(child);
        this.proxy.addChild(child);
    };

    visualProto.addNewChild = function(child){
        this.container.addChild(child);
        this.proxy.addChild(child);
    };

    visualProto.computeLayoutResize = function (rect, direction) {
        this.proxy.computeLayoutResize(rect, direction);
        this.eventManager.call(Commands.SET_CHILD_POSITION, rect, direction);
    };

    visualProto.computeLayoutMove = function (rect) {
        this.proxy.computeLayoutMove(rect);
        this.eventManager.call(Commands.COMPUTE_LAYOUT_MOVE);
    };

    visualProto.memento = function (rect) {
        this.proxy.memento();
        this.eventManager.call(Commands.MEMENTO,rect);
    };

    visualProto.expand = function (rect) {
      this.proxy.expand(rect);
    };

    visualProto.getSiblings = function () {
        this.proxy.getSiblings();
        this.eventManager.call(Commands.GET_SIBLINGS);
    };

    visualProto.siblings = function (siblings) {
        this.eventManager.call(Commands.SIBLINGS, siblings);
    };

    visualProto.removeChildrenInContainer = function (ids) {
        this.proxy.removeChildrenInContainer(ids);
    };

    visualProto.safeState = function () {
        this.proxy.safeState();
        this.eventManager.call(Commands.SAFE_STATE);
    };
    visualProto.removeChild = function (id) {
        this.container.removeChild(id);
    };


    visualProto.setChildPosition = function (rect, resize) {
        //console.log(id+"-"+left+"-"+top+"-"+ right+"-"+ bottom);
        var child = this.container.getChild(rect.id);
        if(child){
            child.setPosition(rect, resize);
            this.eventManager.call(Commands.SET_CHILD_POSITION,rect);
        }
    };

    return VisualSweeperService;

})();