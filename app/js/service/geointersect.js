var GeoIntersect;
GeoIntersect = (function () {
    function GeoIntersect(mover){
        this.mover = mover;
    }
    Object.defineProperties(GeoIntersect.prototype,{
        'getDirection':{
            writable:false,
            enumerable:false,
            value:function (rect) {
                var top = this.mover.top > rect.bottom ? this.mover.top - rect.bottom : rect.bottom - this.mover.top,
                    right = this.mover.right > rect.left ? this.mover.right - rect.left : rect.left - this.mover.right,
                    bottom = this.mover.bottom > rect.top ? this.mover.bottom - rect.top : rect.top - this.mover.bottom,
                    left = this.mover.left > rect.right ? this.mover.left - rect.right : rect.right - this.mover.left,
                    horizontal = right > left ? {distance:left,direction:Direction.LEFT} : {distance:right,direction:Direction.RIGHT},
                    vertical = bottom > top ? {distance:top,direction:Direction.TOP} : {distance:bottom,direction:Direction.BOTTOM};
                return horizontal.distance < vertical.distance ? horizontal.direction : vertical.direction;
            }
        },
        'isAccepted':{
            writable:false,
            enumerable:false,
            value:function () {
                return true;
            }
        }
    });
    return GeoIntersect;
})();