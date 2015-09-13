var CoordinatorRect;
CoordinatorRect = (function () {
    /**
     * @param {String} id
     * @param {VisualRect} rectA
     * @param {VisualRect} rectB
     * @param {HTMLDivElement} fetlock
     * @param {CoordinatorHandler} coordinator
     */
    function CoordinatorRect(id, rectA, rectB, fetlock, coordinator){
        var isVertical = fetlock.classList.contains('fetlock-vertical'),
            left = rectA.left,
            top = rectA.top,
            right = isVertical ? rectA.right : rectB.right,
            bottom = isVertical ? rectB.bottom : rectA.bottom,
            handler = new Handler(id);
        this.event = false;
        this.eventZero = 0;
        VisualRect.call(this, id, 'coordinate-rect', left, top, right, bottom);
        Object.defineProperties(this, {
            'rectA':{
                get: function () {
                    return rectA;
                }
            },
            'rectB':{
                get: function () {
                    return rectB;
                }
            },
            'margin':{
                value:coordinator.margin,
                writable:false,
                enumerable:false
            },
            'coordinator':{
                value:coordinator,
                writable:false,
                enumerable:false
            },
            'fetlock':{
                value:fetlock,
                writable:false,
                enumerable:false
            },
            'parent':{
                value:null,
                writable:true,
                enumerable:true
            },
            'handler':{
                value:handler,
                writable:true,
                enumerable:true
            },
            'isVertical':{
                value:isVertical,
                writable:false,
                enumerable:false
            },
            'inMemory':{
                value:null,
                writable:true,
                enumerable:false
            }
        });

        this.node.appendChild(rectA.node);
        this.node.appendChild(rectB.node);
        rectA.node.draggable = false;
        rectB.node.draggable = false;
        if(isVertical){
            rectA.setPosition({left:0,top:0,right:this.width,bottom:rectA.height});
            rectB.setPosition({left:0,top:this.height-rectB.height,right:this.width,bottom:this.height});
            fetlock.style.top = (rectA.height+(this.margin/2))+'px';
            fetlock.style.left = '';
        }else{
            rectA.setPosition({left:0,top:0,right:rectA.width,bottom:this.height});
            rectB.setPosition({left:this.width-rectB.width,top:0,right:this.width,bottom:this.height});
            fetlock.style.left = (rectA.width+(this.margin/2))+'px';
            fetlock.style.top = '';
        }
        handler.addHandler(rectA.handler);
        handler.addHandler(rectB.handler);

        this.node.appendChild(fetlock);

        this.addHandlerToFetlock();

    }

    CoordinatorRect.prototype = Object.create(VisualRect.prototype,{
        'setPosition':{
            writable:false,
            enumerable:false,
            value:function (rect,direction) {
                var valid = true;
                if(direction){
                    var rectA = this.rectA,
                        rectB = this.rectB;

                    if(this.inMemory || this.isValid(rect, direction)) {
                        rectA.setPosition(this.inMemory.rectA, direction);
                        rectB.setPosition(this.inMemory.rectB,direction);
                        this.inMemory = null;
                        if(this.isVertical){
                            this.fetlock.style.top = (rectA.height + (this.margin / 2)) + 'px';
                        }else{
                            this.fetlock.style.left = (rectA.width + (this.margin / 2)) + 'px';
                        }
                    }else{
                        valid = false;
                    }
                }
                if(valid){
                    VisualRect.prototype.setPosition.call(this, rect, direction);
                }
            }
        },
        "isValid": {
            writable: false,
            enumerable: false,
            value: function (rect, direction) {
                var rectA = this.rectA,
                    rectB = this.rectB,
                    width = rect.right - rect.left,
                    height = rect.bottom - rect.top;
                if(this.isVertical){
                    return this.validateVertical(rectA, rectB, width, height, direction);
                }else{
                    return this.validateHorizontal(rectA, rectB, width, height, direction);
                }
            }
        },
        "validateVertical": {
            writable: false,
            enumerable: false,
            value: function (rectA, rectB, width, height, direction) {
                var valid = false,
                    topB =  rectB.top,
                    bottomA = rectA.bottom;
                if(Direction.hasTopDirection(direction)){
                    topB = height - rectB.height;
                    bottomA =  topB - this.margin;
                }
                if(Direction.hasBottomDirection(direction)){
                    topB = rectA.bottom + this.margin;
                }
                var newYRectA = {left:0,top:0,right:width,bottom:bottomA},
                    newYRectB = {left:0,top:topB,right:width,bottom:height};
                if(rectA.isValid(newYRectA, direction) && rectB.isValid(newYRectB, direction)) {
                    this.inMemory = {
                        'rectA':newYRectA,
                        'rectB':newYRectB
                    };
                    valid = true
                }
                return valid;
            }
        },
        "validateHorizontal": {
            writable: false,
            enumerable: false,
            value: function (rectA, rectB, width, height, direction) {
                var valid = false,
                    leftB =  rectB.left,
                    rightA = rectA.right;
                if(Direction.hasLeftDirection(direction)){
                    leftB = width - rectB.width;
                    rightA =  leftB - this.margin;
                }
                if(Direction.hasRightDirection(direction)){
                    leftB = rectA.right + this.margin;
                }
                var newXRectA = {left:0,top:0,right:rightA,bottom:height},
                    newXRectB = {left:leftB,top:0,right:width,bottom:height};
                if(rectA.isValid(newXRectA, direction) && rectB.isValid(newXRectB, direction)) {
                    this.inMemory = {
                        'rectA':newXRectA,
                        'rectB':newXRectB
                    };
                    valid = true;
                }
                return valid;
            }
        },
        "unbound": {
            writable: false,
            enumerable: false,
            value: function () {
                if(this.parent){
                    this.parent.unbound();
                }
                var rectA = this.rectA,
                    rectB = this.rectB;
                if(rectA instanceof CoordinatorRect){
                    rectA.parent = null;
                }
                if(rectB instanceof CoordinatorRect){
                    rectB.parent = null;
                }
                if(this.isVertical){
                    var left = this.left,
                        right = this.right,
                        topA = this.top,
                        bottomA = topA + rectA.height,
                        bottomB = this.bottom,
                        topB = bottomB - rectB.height;

                    rectA.setPosition({left:left,top:topA,right:right,bottom:bottomA});
                    rectB.setPosition({left:left,top:topB,right:right,bottom:bottomB});
                }else {
                    var top = this.top,
                        bottom = this.bottom,
                        leftA = this.left,
                        rightA = leftA + rectA.width,
                        rightB = this.right,
                        leftB = rightB - rectB.width;
                    rectA.setPosition({left: leftA, top: top, right: rightA, bottom: bottom});
                    rectB.setPosition({left: leftB, top: top, right: rightB, bottom: bottom});
                }
                this.handler.resetCallbacks();
                this.coordinator.service.removeChildrenInContainer([this.id ]);
                this.coordinator.service.addNewChild(rectA);
                this.coordinator.service.addNewChild(rectB);
                this.coordinator.container.removeChild(this.id);
            }
        },
        'coordinateSize': {
            writable: false,
            enumerable: false,
            value:function (event) {
                if(this.event){
                    var rectA = this.rectA,
                        rectB = this.rectB,
                        coordinator = this.coordinator;
                    if(this.isVertical){
                        var y = this.eventZero - event.pageY,
                            bottomA = this.rectA.bottom - y,
                            topB = this.rectB.top - y,
                            newYRectA = {left:0, top:0, right:this.width, bottom:bottomA},
                            newYRectB = {left:0, top:topB, right:this.width, bottom:this.height };
                        if(rectA.isValid(newYRectA, Direction.BOTTOM) && rectB.isValid(newYRectB, Direction.TOP)){
                            rectA.setPosition(newYRectA,Direction.BOTTOM);
                            rectB.setPosition(newYRectB,Direction.TOP);
                            coordinator.activeRule(rectA.node.getBoundingClientRect(),'bottom');
                            coordinator.activeRule(rectB.node.getBoundingClientRect(),'top');
                        }
                        this.eventZero = event.pageY;
                        this.fetlock.style.top =  (rectA.height+(this.margin/2))+'px';
                    }else {
                        var x = this.eventZero - event.pageX,
                            rightA = this.rectA.right - x,
                            leftB = this.rectB.left - x,
                            newXRectA = {left: 0,top: 0,right: rightA,bottom: this.height},
                            newXRectB = {left: leftB,top: 0,right: this.width,bottom: this.height};
                        if(rectA.isValid(newXRectA, Direction.RIGHT) && rectB.isValid(newXRectB, Direction.LEFT)) {
                            rectA.setPosition(newXRectA, Direction.RIGHT);
                            rectB.setPosition(newXRectB, Direction.LEFT);
                            coordinator.activeRule(rectA.node.getBoundingClientRect(), 'right');
                            coordinator.activeRule(rectB.node.getBoundingClientRect(), 'left');
                        }
                        this.eventZero = event.pageX;
                        this.fetlock.style.left = (rectA.width + (this.margin / 2)) + 'px';
                    }
                }
            }
        },
        'addHandlerToFetlock': {
            writable: false,
            enumerable: false,
            value: function () {
                var self = this,
                    fetlock = self.fetlock;
                fetlock.addEventListener('mousedown', function (e) {
                    self.event = true;
                    self.eventZero = self.isVertical ? e.pageY : e.pageX;
                });
                fetlock.addEventListener('dblclick', self.unbound.bind(self));
                self.node.addEventListener('mousemove', self.coordinateSize.bind(self));
                self.node.addEventListener('mouseup', function () {
                    if(self.event){
                        self.event = false;
                        self.coordinator.hideRules();
                    }
                });
                self.node.addEventListener('mouseleave', function (e) {
                    if(self.event && e.target == self.node){
                        self.event = false;
                        self.coordinator.hideRules();
                    }
                });
            }
        }
    });

    return CoordinatorRect;
})();