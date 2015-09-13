var GeoIntersectBottomLeftTopRight;
GeoIntersectBottomLeftTopRight = (function () {
    function GeoIntersectBottomLeftTopRight(resizer,isFirstPoint){
        var rl = resizer.right - resizer.left;
        this.aUp = (resizer.top - resizer.bottom) / rl;
        this.bUp = (resizer.right * resizer.bottom - resizer.top * resizer.left) / rl;
        this.isFirstPoint = isFirstPoint;
    }
    Object.defineProperties(GeoIntersectBottomLeftTopRight.prototype,{
        'getDirection':{
            writable:false,
            enumerable:false,
            value:function (rect) {
                if((this.aUp * rect.x + this.bUp) > rect.y){
                    return this.isFirstPoint ? Direction.LEFT : Direction.TOP;
                }else{
                    return this.isFirstPoint ? Direction.BOTTOM : Direction.RIGHT  ;
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
                    function(){ return !self.isFirstPoint;},
                    function(){ return !self.isFirstPoint;},
                    function(){ return self.isFirstPoint;});
            }
        }
    });

    return GeoIntersectBottomLeftTopRight;
})();