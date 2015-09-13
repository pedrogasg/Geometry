var GeoIntersectMono;
GeoIntersectMono = (function () {
    function GeoIntersectMono(direction){
        this.direction = direction;
    }
    Object.defineProperties(GeoIntersectMono.prototype,{
        'getDirection':{
            writable:false,
            enumerable:false,
            value:function () {
                return this.direction;
            }
        },
        'isAccepted':{
            writable:false,
            enumerable:false,
            value:function (direction) {
                return this.direction == direction;
            }
        }
    });

    return GeoIntersectMono;
})();