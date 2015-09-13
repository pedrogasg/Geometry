var GeoIntersectTrial;
GeoIntersectTrial = (function () {
    function GeoIntersectTrial(mover, direction){
        this.mover = mover;
        this.direction = direction;
    }

    function horizontalDirection(mover, rect){
        var right = mover.right > rect.left ? mover.right - rect.left : rect.left - mover.right,
            left = mover.left > rect.right ? mover.left - rect.right : rect.right - mover.left;
        return right > left  ? Direction.LEFT : Direction.RIGHT;
    }

    function verticalDirection(mover, rect){
        var top = mover.top > rect.bottom ? mover.top - rect.bottom : rect.bottom - mover.top,
            bottom = mover.bottom > rect.top ? mover.bottom - rect.top : rect.top - mover.bottom;
        return top > bottom ? Direction.BOTTOM : Direction.TOP;
    }

    Object.defineProperties(GeoIntersectTrial.prototype,{
        'getDirection':{
            writable:false,
            enumerable:false,
            value:function (rect) {
                var self = this;
                return Direction.returnByDirection(this.direction,
                        function(){ if(self.x > rect.left) return verticalDirection(self.mover, rect);},
                        function(){ if(self.y > rect.top) return horizontalDirection(self.mover, rect);},
                        function(){ if(self.x > rect.right) return verticalDirection(self.mover, rect);},
                        function(){ if(self.y > rect.bottom) return horizontalDirection(self.mover, rect);}) || GeoIntersect.prototype.getDirection.call(this,rect);
            }
        },
        'isAccepted':{
            writable:false,
            enumerable:false,
            value:function (direction) {
                return direction != this.direction;
            }
        }
    });

    return GeoIntersectTrial;
})();