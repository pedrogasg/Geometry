var VisualToGeoProxy;
VisualToGeoProxy = (function () {
     function VisualToGeoProxy(visualService){
         this.visualService = visualService;
         this.geoService = new GeoSweeperService(this);
         this.margin = 0;
     }

    var VTGProto = VisualToGeoProxy.prototype;

    VTGProto.setMargin = function (margin) {
      this.margin = Math.floor(margin / 2);
    };
    /**
     *
     */
    VTGProto.memento = function () {
        this.geoService.memento();
    };

    VTGProto.computeLayoutResize = function (rect, direction) {
        this.geoService.computeLayoutResize(this.visualToGeoRect(rect,this.margin), direction);
    };
    /**
     *
     * @param rect
     */
    VTGProto.computeLayoutMove = function (rect) {
        this.geoService.computeLayoutMove(this.visualToGeoRect(rect,this.margin));
    };

    /**
     *
     * @param {VisualContainer} container
     */
    VTGProto.setContainer = function (container) {
        this.geoService.setContainer(this.visualToGeoContainer(container));
    };

    /**
     *
     * @param {VisualRect} child
     */
    VTGProto.addChild = function (child) {
        this.geoService.addChild(this.visualToGeoRect(child,this.margin));
    };

    VTGProto.expand = function (child) {
        this.geoService.expand(this.visualToGeoRect(child,this.margin));
    };

    VTGProto.getSiblings = function () {
        this.geoService.getSiblings();
    };

    VTGProto.removeChildrenInContainer = function (ids) {
        this.geoService.removeChildrenInContainer(ids);
    };

    VTGProto.safeState = function () {
        this.geoService.safeState();
    };

    /**
     *
     * @param {VisualRect} rect
     * @param {number} margin
     * @returns {GeoRect}
     */
    VTGProto.visualToGeoRect = function(rect, margin){
        margin = margin || 0;
        return new GeoRect(rect.id, rect.left-margin, rect.top-margin, rect.right+margin, rect.bottom+margin);
    };

    /**
     *
     * @param {VisualContainer} container
     * @returns {GeoContainer}
     */
    VTGProto.visualToGeoContainer = function (container) {
        var geoChildren = [];
        if(container.children){
            for(var i = 0,child; child = container.children[i];i++){
                geoChildren.push(this.visualToRect(child),this.margin);
            }
        }
        return new GeoContainer(this.visualToGeoRect(container, -this.margin), geoChildren);
    };

    VTGProto.removeChild = function (id) {
        this.visualService.removeChild(id);
    };

    VTGProto.siblings = function (data) {
        this.visualService.siblings(data)
    };

    /**
     *
     * @param {GeoRect} rect
     */
    VTGProto.setChildPosition = function (rect, resize) {
        rect = rect.toJSON();
        rect.left+=this.margin;
        rect.top+=this.margin;
        rect.right-=this.margin;
        rect.bottom-=this.margin;
        this.visualService.setChildPosition(rect, resize);
    };

    VTGProto.setPosition = function (rectArray) {
        for(var i = 0,rect;rect = rectArray[i];i++){
            rect = rect.toJSON();
            rect.left+=this.margin;
            rect.top+=this.margin;
            rect.right-=this.margin;
            rect.bottom-=this.margin;
            this.visualService.setChildPosition(rect, false);
        }
    };

    VTGProto.log = function (val) {
        console.log(val);
    };
    return VisualToGeoProxy;
})();