var CoordinatorHandler;
CoordinatorHandler = (function () {
    function CoordinatorHandler(service){
        this.service = service;
        this.margin = service.margin;
        this.container = null;
        this.containerNode = null;
        this.rules = {};
        this.eventManager = null;
        this.childId = null;
        this.handlers = [];
        this.fetlockListener = this.mouseDownFetlockHandler.bind(this);
    }

    var coordinatorProto = CoordinatorHandler.prototype,
        RULE = 'rule',
        DIRECTIONS = Object.keys(Direction);

    coordinatorProto.setEventManager = function (eventManager) {
        this.eventManager = eventManager;
    };

    coordinatorProto.createRule = function (name) {
        var rule = document.createElement('div');
        rule.className = RULE + '-' +name;
        return rule;
    };

    coordinatorProto.childAddEvents = function (child) {
        if(child.handler){
            var handler = child.handler,
                id = handler.parentId;
            handler.setNewCallback('dblclick', function (e) {
                var rect = this.container.getChild(id);
                if(rect instanceof CoordinatorRect){
                    e.preventDefault();
                    return false;
                }
                this.service.expand(rect);
                this.hideRules();
            }.bind(this));
        }
    };

    coordinatorProto.setContainer = function (container) {
        this.container = container;
        this.containerNode = container.node;
        for(var i = 0,direction; direction = DIRECTIONS[i];i++){
            direction = direction.toLowerCase();
            var rule = this.createRule(direction);
            this.rules[direction] = rule;
            document.body.appendChild(rule);
        }
        this.containerNode.addEventListener('mouseup', function () {
            this.hideRules();
        }.bind(this));
        this.eventManager.subscribe(Commands.MEMENTO, this.setChildId.bind(this));
        this.eventManager.subscribe(Commands.SET_CHILD_POSITION, this.rulesForChildPosition.bind(this));
        this.eventManager.subscribe(Commands.SAFE_STATE, this.safeState.bind(this));
        this.eventManager.subscribe(Commands.SIBLINGS,this.setSiblingsHandlers.bind(this));
    };

    coordinatorProto.createFetlock = function (a, b, vertical) {
        var fetlock = document.createElement('div'),
            container = this.container,
            childA = container.getChild(a),
            style = fetlock.style,
            margin =this.margin / 2 + 1;
        fetlock.classList.add('fetlock');
        if(vertical){
            fetlock.classList.add('fetlock-vertical');
            style.top = (childA.bottom+margin)+'px';
            style.left = childA.x+'px';
        }else{
            fetlock.classList.add('fetlock-horizontal');
            style.top = childA.y+'px';
            style.left = (childA.right+margin)+'px';
        }
        fetlock.dataset['a'] = a;
        fetlock.dataset['b'] = b;
        fetlock.addEventListener('mousedown', this.fetlockListener, true);
        container.node.appendChild(fetlock);
        return fetlock;

    };

    coordinatorProto.mouseDownFetlockHandler = function (e) {
        e.preventDefault();
        var target = e.target,
            dataset = target.dataset,
            a = dataset['a'],
            b = dataset['b'],
            childA = this.container.getChild(a),
            childB = this.container.getChild(b),
            rect;
        target.removeEventListener('mousedown',this.fetlockListener,true);
        target.classList.add('active');
        this.service.removeChildrenInContainer([a,b]);
        rect = new CoordinatorRect(a+'-'+b, childA, childB,target ,this);
        if(childA instanceof CoordinatorRect){
            childA.parent = rect;
        }
        if(childB instanceof CoordinatorRect){
            childB.parent = rect;
        }
        this.service.addNewChild(rect);
        this.container.removeChild(a);
        this.container.removeChild(b);
        this.eraseHandlers();
        this.service.getSiblings();
        return false;
    };

    coordinatorProto.createLockers = function (array, predicate) {
        for(var i = 0,sibling; sibling = array[i];i++){
            this.createFetlock(sibling.a,sibling.b,predicate);
        }
    };

    coordinatorProto.setSiblingsHandlers = function (siblings) {
        var vertical = siblings['vertical'],
            horizontal = siblings['horizontal'];
        this.createLockers(siblings['vertical'], true);
        this.createLockers(siblings['horizontal'], false);
    };

    coordinatorProto.eraseHandlers = function () {
        for(var i = 0, handlers = document.querySelectorAll('.fetlock'),handler; handler = handlers[i];i++){
            if(handler.parentNode == this.containerNode){
                this.container.node.removeChild(handler);
            }
        }
    };

    coordinatorProto.setChildId = function (rect) {
        this.childId = rect.id;
    };

    coordinatorProto.hideRules = function () {
        for(var i = 0,direction; direction = DIRECTIONS[i];i++){
            var rule = this.rules[direction.toLowerCase()];
            rule.style.display = 'none';
        }
    };

    coordinatorProto.safeState = function () {
        this.hideRules();
        this.eraseHandlers();
        this.service.getSiblings();
    };

    coordinatorProto.activeRule = function (rect, directionName) {
        var rule = this.rules[directionName];
        if(directionName == 'top' || directionName == 'bottom'){
            rule.style.top = rect[directionName]+ 'px';
        }else{
            rule.style.left = rect[directionName]+ 'px';
        }
        rule.style.display = 'block';
    };

    coordinatorProto.rulesForChildPosition = function (rect, direction) {
        if(this.childId && this.childId==rect.id) {
            var rectBounds = this.container.getChild(rect.id).node.getBoundingClientRect();
            if(direction){
                var self = this;
                Direction.callByDirection(direction,
                    function(){self.activeRule(rectBounds,'left');},
                    function(){self.activeRule(rectBounds,'top');},
                    function(){self.activeRule(rectBounds,'right');},
                    function(){self.activeRule(rectBounds,'bottom');});
            }else
                for (var i = 0, directionName; directionName = DIRECTIONS[i]; i++) {
                    directionName = directionName.toLowerCase();
                    var rule = this.rules[directionName],
                        position = rectBounds[directionName] + 'px';
                    rule.style.display = 'block';
                    if (i % 2 != 0) {
                        rule.style.top = position;
                    } else {
                        rule.style.left = position;
                    }
                }
        }
    };
    return CoordinatorHandler;
})();
