var GeoIntersectTopLeftBottomRight;
GeoIntersectTopLeftBottomRight = (function () {
    function GeoIntersectTopLeftBottomRight(resizer,isFirstPoint){
        var rl = resizer.right - resizer.left;
        this.aDown = (resizer.bottom - resizer.top) / rl;
        this.bDown = (resizer.top * resizer.right - resizer.left * resizer.bottom) / rl;
        this.isFirstPoint = isFirstPoint;
    }
    Object.defineProperties(GeoIntersectTopLeftBottomRight.prototype,{
        'getDirection':{
            writable:false,
            enumerable:false,
            value:function (rect) {
                if((this.aDown * rect.x + this.bDown) > rect.y){
                    return this.isFirstPoint ? Direction.TOP : Direction.RIGHT;
                }else{
                    return this.isFirstPoint ? Direction.LEFT : Direction.BOTTOM  ;
                }
            }
        },
        'isAccepted':{
            writable:false,
            enumerable:false,
            value:function (direction) {
                var self = this;
                return Direction.returnByDirection(direction,
                    function(){ return self.isFirstPoint;},
                    function(){ return self.isFirstPoint;},
                    function(){ return !self.isFirstPoint;},
                    function(){ return !self.isFirstPoint;});
            }
        }
    });
    return GeoIntersectTopLeftBottomRight;
})();