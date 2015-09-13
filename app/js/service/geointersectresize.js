var GeoIntersectResize;
GeoIntersectResize = (function () {
    function GeoIntersectResize(resizer){
        var rl = resizer.right - resizer.left;
        this.aDown = (resizer.bottom - resizer.top) / rl;
        this.bDown = (resizer.top * resizer.right - resizer.left * resizer.bottom) / rl;
        this.aUp = (resizer.top - resizer.bottom) / rl;
        this.bUp = (resizer.right * resizer.bottom - resizer.top * resizer.left) / rl;
    }
    Object.defineProperties(GeoIntersectResize.prototype,{
        'getDirection':{
            writable:false,
            enumerable:false,
            value:function (rect) {
                var isUp =(this.aUp * rect.x + this.bUp) > rect.y,
                    isDown = (this.aDown * rect.x + this.bDown) > rect.y;
                if(isUp){
                    return isDown ? Direction.TOP : Direction.LEFT;
                }else{
                    return isDown ? Direction.RIGHT : Direction.BOTTOM  ;
                }
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
    return GeoIntersectResize;
})();