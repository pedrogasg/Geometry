var GeoSweeperService;
GeoSweeperService = (function () {

    /**
     *
     * @constructor
     */
    function GeoSweeperService(proxy){
        this.geoContainer = null;
        this.freezeContainer = null;
        this.workingContainer = null;
        this.workingGeoRect = null;
        this.sweeper = new GeoSweeper();
        this.snaper = new GeoSnaper();
        this.proxy = proxy;
    }


    var geoServiceProto = GeoSweeperService.prototype;

    Object.defineProperties(GeoSweeperService.prototype, {
        'setPosition': {
            writable: false,
            enumerable: false,
            value: function (batch) {
                this.proxy.setPosition(batch);
            }
        },
        'setContainer': {
            writable: false,
            enumerable: false,
            value: function (container) {
                this.geoContainer = container;
            }
        },
        'addChild': {
            writable: false,
            enumerable: false,
            value: function (child) {
                this.memento();
                var answer = this.sweeper.computeLayoutMove(child, this.freezeContainer);
                if (Boolean(answer)) {
                    this.freezeContainer.addChild(child);
                    this.geoContainer = this.freezeContainer;
                    this.placeChildren(child, this.geoContainer);
                } else {
                    this.proxy.removeChild(child.id);
                    this.memento();
                }
            }
        },
        'placeChildren': {
            writable: false,
            enumerable: false,
            value: function (mover, container, direction) {
                var childrenToPlace = [];
                for (var i = 0, child; child = container.children[i]; i++) {
                    if (mover.id == child.id) {
                        child.copy(mover);
                        if (this.workingGeoRect && this.workingGeoRect.id == child.id) {
                            this.workingGeoRect = null;
                        }
                        this.setChildPosition(child, direction);
                    } else {
                        //if(!child.pristine){
                        childrenToPlace.push(child);
                        //}
                    }
                }
                this.setPosition(childrenToPlace);
            }
        },
        'computeLayoutResize': {
            writable: false,
            enumerable: false,
            value: function (resizer, direction) {

                this.snaper.resizeToClosest(resizer, this.geoContainer, direction);
                this.memento();
                var answer = this.sweeper.computeLayoutResize(resizer, this.freezeContainer, direction);
                if (answer) {
                    this.placeChildren(resizer, this.freezeContainer, direction);
                    this.working(this.freezeContainer);
                }
            }
        },
        'computeLayoutMove': {
            writable: false,
            enumerable: false,
            value: function (mover) {

                this.snaper.moveToClosest(mover, this.geoContainer);
                this.memento();
                var answer = this.sweeper.computeLayoutMove(mover, this.freezeContainer);
                if (answer) {
                    this.placeChildren(mover, this.freezeContainer);
                    this.working(this.freezeContainer);
                }
            }
        },
        'removeChildrenInContainer': {
            writable: false,
            enumerable: false,
            value: function (childrenIds) {
                for (var i = 0, childId; childId = childrenIds[i]; i++) {
                    this.geoContainer.removeChild(childId);
                }
            }
        },
        'getSiblings': {
            writable: false,
            enumerable: false,
            value: function () {
                this.proxy.siblings(this.snaper.getSiblings(this.geoContainer));
            }
        },
        'expand': {
            writable: false,
            enumerable: false,
            value: function (expander) {
                this.snaper.expand(expander, this.geoContainer);
                this.setChildPosition(expander);
            }
        },
        'memento': {
            writable: false,
            enumerable: false,
            value: function () {
                this.freezeContainer = this.geoContainer.getCopy();
            }
        },
        'working': {
            writable: false,
            enumerable: false,
            value: function (container) {
                this.workingContainer = container.getCopy();
            }
        },
        'safeState': {
            writable: false,
            enumerable: false,
            value: function () {
                if (!this.workingGeoRect) {
                    this.geoContainer = this.freezeContainer;
                } else {
                    if (!this.workingContainer) this.working(this.geoContainer);
                    this.placeChildren(this.workingGeoRect, this.workingContainer);
                    this.geoContainer = this.workingContainer;
                }
                for (var i = 0, child; child = this.geoContainer.children[i]; i++) {
                    child.pristine = true;
                }
            }
        }
    });

    return GeoSweeperService;

})();
