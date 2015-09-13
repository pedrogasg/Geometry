var ResizeHandler;
ResizeHandler = (function () {
     function ResizeHandler(service){
          this.service = service;
          this.change = function(){};
          this.container = null;
          this.containerNode = null;
          this.resizeEvent = false;
          this.currentDirection = null;
          this.count = 0;
          this.eventManager = null;
     }

     var resizerProto = ResizeHandler.prototype,
         LIMITATOR = 5,
         CLASSNAME = 'resize-handler',
         DIRECTION_NAMES = Object.getOwnPropertyNames(Direction);

     resizerProto.setEventManager = function (eventManager) {
          this.eventManager = eventManager;
     };

     resizerProto.createHandler = function (id, direction) {
          var handler = document.createElement('div'),
              classList = handler.classList,
              data = handler.dataset;
          classList.add(CLASSNAME);
          classList.add(CLASSNAME + '-' + direction.toLowerCase());
          data.id = id;
          data.direction = Direction[direction];
          return handler;
     };

     resizerProto.childAddEvents = function (child) {
          var node = child.node;
          for(var i = 0,direction; direction = DIRECTION_NAMES[i];i++){
               node.appendChild(this.createHandler(child.id,direction))
          }
     };

     resizerProto.setContainer = function(container){
          this.container = container;
          this.containerNode = container.node;
          this.containerNode.addEventListener('mousedown' , this.handleMouseDown.bind(this), false);
          this.containerNode.addEventListener('mousemove' , this.handleMouseMove.bind(this), false);
          this.containerNode.addEventListener('mouseup' , this.handleMouseUp.bind(this), false);
          this.containerNode.addEventListener('mouseout' , this.handleMouseOut.bind(this), false);
          for(var i = 0,child; child = container.children[i];i++){
               this.childAddEvents(child);
          }
     };

     resizerProto.handleMouseDown = function (e) {
          var target = e.target;
          if(target.classList.contains(CLASSNAME)){
               var id = target.dataset.id,
                   child = this.container.getChild(id),
                   direction = parseInt(target.dataset.direction,10);
               this.resizeEvent = true;
               this.currentDirection = direction;
               this.change = this.stateChanger(child, e.pageX, e.pageY);
               this.service.memento(child);
          }
     };

     resizerProto.handleMouseMove = function (e) {
          if(this.resizeEvent && this.currentDirection){
               if(this.count++ % LIMITATOR == 0){
                    var t = this.change(e.pageX, e.pageY);
                    this.service.computeLayoutResize(t, this.currentDirection);
               }
          }
     };

     resizerProto.handleMouseUp = function () {
          if(this.resizeEvent){
               this.resizeEvent = false;
               this.currentDirection = null;
               this.service.safeState();
          }
     };

     resizerProto.handleMouseOut = function (e) {
          if(this.resizeEvent && (e.pageX > this.container.right || e.pageX < this.container.left || e.pageY > this.container.bottom || e.pageY < this.container.top)){
               this.resizeEvent = false;
               this.currentDirection = null;
               this.service.safeState();
          }
     };

     resizerProto.stateChanger = function (child, x, y) {
          var direction = this.currentDirection,
              startX = Direction.hasLeftDirection(direction) ? child.left - x : child.right  - x,
              startY = Direction.hasTopDirection(direction) ? child.top - y : child.bottom  - y,
              square = child.toJSON();
          return function (x$, y$) {
               var deltaX = x$ + startX,
                   deltaY = y$ + startY;
               Direction.callByDirection(direction,
                   function(){ square.left = deltaX;},
                   function(){ square.top = deltaY;},
                   function(){ square.right = deltaX;},
                   function(){ square.bottom = deltaY;});
               return square;
          }
     };

     return ResizeHandler;
})();