var Direction;
Direction = (function(){
    function Direction() {
        Object.defineProperties(this, {
            'LEFT': {
                value: 1,
                writable: false,
                enumerable:true
            },
            'TOP_LEFT':{
                value:3,
                writable:false
            },
            'TOP': {
                value: 2,
                writable: false,
                enumerable:true
            },
            'TOP_RIGHT': {
                value: 6,
                writable: false
            },
            'RIGHT': {
                value: 4,
                writable: false,
                enumerable:true
            },
            'BOTTOM_RIGHT': {
                value: 12,
                writable: false
            },
            'BOTTOM': {
                value: 8,
                writable: false,
                enumerable:true
            },
            'BOTTOM_LEFT': {
                value: 9,
                writable: false
            }
        });
    }
    Object.defineProperties(Direction.prototype, {
        'callByDirection': {
            writable: false,
            enumerable:false,
            value: function(direction,callbackLeft,callbackTop,callbackRight,callbackBottom){
                //noinspection JSBitwiseOperatorUsage
                if(direction & this.LEFT){
                    callbackLeft();
                }
                //noinspection JSBitwiseOperatorUsage
                if(direction & this.TOP){
                    callbackTop();
                }
                //noinspection JSBitwiseOperatorUsage
                if(direction & this.RIGHT){
                    callbackRight();
                }
                //noinspection JSBitwiseOperatorUsage
                if(direction & this.BOTTOM){
                    callbackBottom();
                }
            }
        },
        'returnByDirection':{
            writable:false,
            enumerable:false,
            value:function(direction,callbackLeft,callbackTop,callbackRight,callbackBottom){
                switch (direction){
                    case this.LEFT:
                        return callbackLeft();
                    case this.TOP:
                        return callbackTop();
                    case this.RIGHT:
                        return callbackRight();
                    case this.BOTTOM:
                        return callbackBottom();
                }
            }
        },
        'returnByDiagonalDirection':{
            writable:false,
            enumerable:false,
            value:function(direction,callbackTopLeft,callbackTopRight,callbackBottomRight,callbackBottomLeft){
                switch (direction){
                    case this.TOP_LEFT:
                        return callbackTopLeft();
                    case this.TOP_RIGHT:
                        return callbackTopRight();
                    case this.BOTTOM_RIGHT:
                        return callbackBottomRight();
                    case this.BOTTOM_LEFT:
                        return callbackBottomLeft();
                }
            }
        },
        'isSingleDirection':{
            writable:false,
            enumerable:false,
            value:function (direction) {
                return (direction & direction-1) == 0;
            }
        },
        'getHardDirections':{
            writable:false,
            enumerable:false,
            value:function (direction) {
                var directions = [];
                //noinspection JSBitwiseOperatorUsage
                if(direction & this.LEFT){
                    directions.push(this.LEFT);
                }
                //noinspection JSBitwiseOperatorUsage
                if(direction & this.TOP){
                    directions.push(this.TOP);
                }
                //noinspection JSBitwiseOperatorUsage
                if(direction & this.RIGHT){
                    directions.push(this.RIGHT);
                }
                //noinspection JSBitwiseOperatorUsage
                if(direction & this.BOTTOM){
                    directions.push(this.BOTTOM);
                }
                return directions;
            }
        },
        'hasTopDirection':{
            writable:false,
            enumerable:false,
            value:function (direction) {
                return Boolean(direction & this.TOP);
            }
        },
        'hasLeftDirection':{
            writable:false,
            enumerable:false,
            value:function (direction) {
                return Boolean(direction & this.LEFT);
            }
        },
        'hasBottomDirection':{
            writable:false,
            enumerable:false,
            value:function (direction) {
                return Boolean(direction & this.BOTTOM);
            }
        },
        'hasRightDirection':{
            writable:false,
            enumerable:false,
            value:function (direction) {
                return Boolean(direction & this.RIGHT);
            }
        },
        'opposite':{
            writable:false,
            enumerable:false,
            value:function(direction){
                var self = this;
                if(this.isSingleDirection(direction)){
                    return self.returnByDirection(direction,
                        function(){ return self.RIGHT;},
                        function(){ return  self.BOTTOM;},
                        function(){ return self.LEFT;},
                        function(){ return self.TOP;});
                }else{
                    return self.returnByDiagonalDirection(direction,
                        function(){ return self.BOTTOM_RIGHT;},
                        function(){ return  self.BOTTOM_LEFT;},
                        function(){ return self.TOP_LEFT;},
                        function(){ return self.TOP_RIGHT;});
                }
            }
        }
    });
    return new Direction();
})();