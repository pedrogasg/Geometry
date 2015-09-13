var Handler;
Handler = (function () {
    function Handler(id, callbacks){
        this.parentId = id;
        this.callbacks = callbacks || {};
        this.elements = [];
    }
    var proto = Handler.prototype;

    proto.addElement = function (element) {
        this.elements.push(element);
    };

    proto.setNewCallback = function (event, callback ) {
        for(var i = 0,element; element = this.elements[i];i++){
            element.removeEventListener(event,this.callbacks[event]);
            element.addEventListener(event,callback);
        }
        this.callbacks[event] = callback;
    };

    proto.contains = function (currentElement) {
        for(var i = 0,element; element = this.elements[i];i++){
            if(element.contains(currentElement)){
                return true;
            }
        }
        return false;
    };

    proto.resetCallbacks = function () {
        for(var event in this.callbacks) {
            for (var i = 0, element; element = this.elements[i]; i++) {
                element.removeEventListener(event, this.callbacks[event]);
            }
        }
        this.callbacks = {};
    };

    proto.addHandler = function (handler) {
        handler.resetCallbacks();
        for(var i = 0,element; element = handler.elements[i];i++){
            this.addElement(element);
        }
    }

    return Handler;

})();
