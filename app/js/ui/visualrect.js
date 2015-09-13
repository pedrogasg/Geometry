var VisualRect;
VisualRect = (function () {
    /**
     *
     * @param {string} id
     * @param {string} className
     * @param {number} left
     * @param {number} top
     * @param {number} right
     * @param {number} bottom
     * @constructor
     */
    function VisualRect(id, className, left, top, right, bottom){
        var div = null;
        Object.defineProperties(this, {
            'id': {
                value:id,
                writable: false
            },
            'left': {
                get: function () {
                    return left;
                },
                set: function (value) {
                    this.node.style.left = value+"px";
                    left=value;
                }
            },
            'top': {
                get: function () {
                    return top;
                },
                set: function (value) {
                    this.node.style.top = value+"px";
                    top=value;

                }
            },
            'right': {
                get: function () {
                    return right;
                },
                set: function (value) {
                    this.node.style.width = (value-left)+"px";
                    //div.style.right = value+"px";
                    right=value;
                }
            },
            'bottom': {
                get: function () {
                    return bottom;
                },
                set: function (value) {
                    this.node.style.height = (value-top)+"px";
                    //div.style.bottom = value+"px";
                    bottom=value;
                }
            },
            'node':{
                enumerable:true,
                get: function () {
                    if(!div){
                        div = this.createDiv(id, className, left, top, right, bottom);
                    }
                    return div;
                },
                set: function (value) {
                    if(!div){
                        div = value;
                    }
                }
            },
            'x':{
                get: function () {
                    return (left + right)/2;
                }
            },
            'y':{
                get: function () {
                    return (bottom + top)/2;
                }
            },
            height : {
                enumerable:true,
                get:function(){
                    return bottom - top;
                }
            }
            ,width : {
                enumerable:true,
                get:function(){
                    return right - left;
                }
            },
            'handler':{
                value:null,
                writable:true,
                enumerable:true
            }
        });
    }

    var visualProto = VisualRect.prototype;

    visualProto.createDiv = function (id, className, left, top, right, bottom) {
        var div = document.createElement('div');
        div.id = id;
        div.className = className;
        div.style.left = left+"px";
        div.style.top = top+"px";
        div.style.width = (right-left)+"px";
        div.style.height = (bottom-top)+"px";
        return div;
    };

    /**
     * @param {number} rect.left
     * @param {number} rect.top
     * @param {number} rect.right
     * @param {number} rect.bottom
     */
    visualProto.setPosition = function (rect) {
        this.left = rect.left;
        this.top = rect.top;
        this.right = rect.right;
        this.bottom = rect.bottom;
    };

    visualProto.setSize = function (direction, left, top, right, bottom) {
        var self = this;
        Direction.callByDirection(direction,
            function(){ self.left = left;
                self.right = self.right;},
            function(){ self.top = top;
                self.bottom = self.bottom;},
            function(){ self.right = right;},
            function(){ self.bottom = bottom;});
    };

    visualProto.toJSON = function () {
        return {'id':this.id,
            'left':this.left,
            'top':this.top,
            'right':this.right,
            'bottom':this.bottom};
        //return [this.id,this.left,this.top,this.right,this.bottom,this.constructor.name];
    };
    visualProto.isValid = function(rect){
        //return this.top <= this.bottom && this.left <= this.right;
        return rect.bottom - rect.top >= 50  && rect.right - rect.left >= 50 ;
    };

    return VisualRect;

})();
