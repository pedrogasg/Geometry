var EventManager;
EventManager = (function(){
  function EventManager(){
    this.handlers = [];
    this.events = {};
    for(var i = 0, handler; handler = arguments[i];i++){
      handler.setEventManager(this);
      this.handlers.push(handler);
    }
  }
  var eventProto = EventManager.prototype;

  eventProto.subscribe = function (name, callback) {
    var events = this.events[name] || (this.events[name] = []);
    events.push(callback);
  };

  eventProto.call = function (name,arg1, arg2, arg3) {
    if(this.events[name]){
      for(var i = 0, callback;callback = this.events[name][i];i++){
        callback(arg1, arg2, arg3);
      }
    }
  };

  eventProto.setContainer = function(container){
    for(var i = 0,handler;handler = this.handlers[i];i++){
      handler.setContainer(container);
    }
    for(var i = 0,child;child = container.children[i]; i++){
      this.childAddEvents(child);
    }
  };

  eventProto.childAddEvents = function(child){
    for(var i = 0,handler;handler = this.handlers[i];i++){
      handler.childAddEvents(child);
    }
  };

  return EventManager;
})();