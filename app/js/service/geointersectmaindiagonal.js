var GeoIntersectMainDiagonal;
GeoIntersectMainDiagonal = (function () {
    function GeoIntersectMainDiagonal(mover,isFirstPoint){
        this.mover = mover;
        this.isFirstPoint = isFirstPoint;
    }

    Object.defineProperties(GeoIntersectMainDiagonal.prototype,{
        'getDirection':{
            writable:false,
            enumerable:false,
            value:function (rect) {
                var top = this.mover.top > rect.top ? this.mover.top : rect.top ,
                    right = this.mover.right < rect.right ? this.mover.right : rect.right,
                    bottom = this.mover.bottom < rect.bottom ? this.mover.bottom : rect.bottom,
                    left = this.mover.left > rect.left ? this.mover.left : rect.left;

                if(bottom - top > right - left){
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

    return GeoIntersectMainDiagonal;
})();