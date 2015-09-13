var VisualWorker;
VisualWorker = (function () {
    function VisualWorker(visualService){
        this.visualService = visualService;
        this.geoWorker = new Worker('js/service/geoworker.js');
        this.geoWorker.addEventListener('message', this.eventHandler.bind(this));
        this.margin = 0;
    }

    var workerProto = VisualWorker.prototype;

    workerProto.setMargin = function (margin) {
        this.margin = Math.floor(margin / 2);
    };
    /**
     *
     */
    workerProto.memento = function () {
        this.geoWorker.postMessage({'command':Commands.MEMENTO});
    };

    /**
     *
     * @param {Georect} rect
     * @param {number} direction
     */
    workerProto.computeLayoutResize = function (rect, direction) {
        this.geoWorker.postMessage({
            'command':Commands.COMPUTE_LAYOUT_RESIZE,
            'id':rect.id,
            'left':rect.left-this.margin,
            'top':rect.top-this.margin,
            'right':rect.right+this.margin,
            'bottom':rect.bottom+this.margin,
            'direction':direction
        });
    };

    /**
     *
     * @param rect
     */
    workerProto.computeLayoutMove = function (rect) {
        this.geoWorker.postMessage({
            'command':Commands.COMPUTE_LAYOUT_MOVE,
            'id':rect.id,
            'left':rect.left-this.margin,
            'top':rect.top-this.margin,
            'right':rect.right+this.margin,
            'bottom':rect.bottom+this.margin
        });
    };

    workerProto.removeChildrenInContainer = function (ids) {
        this.geoWorker.postMessage({
            'command':Commands.REMOVE_CHILDREN_IN_CONTAINER,
            'ids':ids
        });
    };
    /**
     *
     * @param {VisualContainer} container
     */
    workerProto.setContainer = function (container) {
        this.geoWorker.postMessage({
            'command':Commands.SET_CONTAINER,
            'id':container.id,
            'left':container.left+this.margin,
            'top':container.top+this.margin,
            'right':container.right-this.margin,
            'bottom':container.bottom-this.margin
        });
    };

    /**
     *
     * @param {VisualRect} child
     */
    workerProto.addChild = function (child) {
        this.geoWorker.postMessage({
            'command':Commands.ADD_CHILD,
            'id':child.id,
            'left':child.left-this.margin,
            'top':child.top-this.margin,
            'right':child.right+this.margin,
            'bottom':child.bottom+this.margin
        });
    };

    /**
     *
     * @param {VisualRect} child
     */
    workerProto.expand = function (child) {
        this.geoWorker.postMessage({
            'command':Commands.EXPAND,
            'id':child.id,
            'left':child.left-this.margin,
            'top':child.top-this.margin,
            'right':child.right+this.margin,
            'bottom':child.bottom+this.margin
        });
    };

    workerProto.getSiblings = function () {
        this.geoWorker.postMessage({'command':Commands.GET_SIBLINGS});
    };

    workerProto.safeState = function () {
        this.geoWorker.postMessage({'command':Commands.SAFE_STATE});
    };
    /**
     *
     * @param {Event} e
     */
    workerProto.eventHandler = function (e) {
        var data = e.data;
        switch (data.command){
            case Commands.SET_CHILD_POSITION:
                this.setChildPosition(data);
                break;
            case Commands.SET_POSITION:
                this.setPosition(data);
                break;
            case Commands.REMOVE_CHILD:
                this.removeChild(data);
                break;
            case Commands.SIBLINGS:
                this.siblings(data);
                break;
            case Commands.LOG:
                this.log(data);
                break;
        }
    };
    /**
     *
     * @param data
     */
    workerProto.removeChild = function (data) {
        this.visualService.errors.push(data.id);
        this.visualService.removeChild(data.id);
    };

    workerProto.siblings = function (data) {
        this.visualService.siblings(data);
    };
    /**
     *
     * @param data
     */
    workerProto.setChildPosition = function (data) {
        data.left+=this.margin;
        data.top+=this.margin;
        data.right-=this.margin;
        data.bottom-=this.margin;
        this.visualService.setChildPosition(data, data.direction);
    };

    workerProto.setPosition = function (data) {
        var rectArray = data.rectArray;
        for(var i = 0,rect;rect = rectArray[i];i++){
            rect.left+=this.margin;
            rect.top+=this.margin;
            rect.right-=this.margin;
            rect.bottom-=this.margin;
            this.visualService.setChildPosition(rect, false);
        }
    };

    
    workerProto.log = function (data) {
        console.log(data.val);
    };

    return VisualWorker;
})();