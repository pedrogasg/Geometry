var GeoSweeper;
GeoSweeper = (function () {
    /**
     *
     * @constant {number}
     */
    var BORDER_MARGIN = 10;

    /**
     *
     * @constructor
     */
    function GeoSweeper(){
        this.maxArea = new GeoRect("sweeper",0,0,0,0);
        this.intersector = null;
        this.displaced = [];
        this.compare = function () {};
        this.inverseCompare = function () {};
        this.compareSide = function () {};
        this.placed = [];
        this.placedNames = {};

    }
    Object.defineProperties(GeoSweeper.prototype, {
        'chooseIntersectorForResize': {
            writable: false,
            enumerable: false,
            value: function (resizer, container, direction) {
                if (Direction.isSingleDirection(direction)) {
                    return new GeoIntersectMono(direction);
                } else {
                    return Direction.returnByDiagonalDirection(direction,
                        function () {
                            return new GeoIntersectTopLeftBottomRight(resizer, true);
                        },
                        function () {
                            return new GeoIntersectBottomLeftTopRight(resizer, false);
                        },
                        function () {
                            return new GeoIntersectBottomLeftTopRight(resizer, true);
                        },
                        function () {
                            return new GeoIntersectTopLeftBottomRight(resizer, false);
                        });
                }
                //return new GeoIntersectResize(resizer);
            }
        },
        'chooseIntersectorForMove': {
            writable: false,
            enumerable: false,
            value: function (mover, container) {
                var beyondTop = mover.top < container.top - BORDER_MARGIN,
                    beyondBottom = mover.bottom > container.bottom + BORDER_MARGIN,
                    beyondLeft = mover.left < container.left - BORDER_MARGIN,
                    beyondRight = mover.right > container.right + BORDER_MARGIN,
                    closeToTop = mover.top + container.top < BORDER_MARGIN,
                    closeToBottom = container.bottom - mover.bottom < BORDER_MARGIN,
                    closeToLeft = container.left + mover.left < BORDER_MARGIN,
                    closeToRight = container.right - mover.right < BORDER_MARGIN;

                if (closeToTop) {
                    if (closeToLeft) {
                        return new GeoIntersectMainDiagonal(mover, false);
                    } else if (closeToRight) {
                        return new GeoIntersectAntiDiagonal(mover, true);
                    } else {
                        if (beyondTop) {
                            return new GeoIntersectMono(Direction.BOTTOM);
                        } else {
                            return new GeoIntersectTrial(Direction.TOP, mover);
                        }
                    }
                } else if (closeToBottom) {
                    if (closeToLeft) {
                        return new GeoIntersectAntiDiagonal(mover, false);
                    } else if (closeToRight) {
                        return new GeoIntersectMainDiagonal(mover, true);
                    } else {
                        if (beyondBottom) {
                            return new GeoIntersectMono(Direction.TOP);
                        } else {
                            return new GeoIntersectTrial(Direction.BOTTOM, mover);
                        }
                    }
                } else if (closeToRight) {
                    if (beyondRight) {
                        return new GeoIntersectMono(Direction.LEFT);
                    } else {
                        return new GeoIntersectTrial(Direction.RIGHT, mover);
                    }
                } else if (closeToLeft) {
                    if (beyondLeft) {
                        return new GeoIntersectMono(Direction.RIGHT);
                    } else {
                        return new GeoIntersectTrial(Direction.LEFT, mover);
                    }
                } else {
                    return new GeoIntersect(mover);
                }
            }
        },
        'initialize': {
            writable: false,
            enumerable: false,
            value: function (direction) {
                this.displaced = [];
                this.compare = GeoRect.comparatorByDirection(direction);
                this.inverseCompare = GeoRect.comparatorByDirectionInverse(direction);
                this.compareSide = GeoRect.sideComparatorByDirection(direction);
                this.placed = new SortArray(this.inverseCompare);
                this.placedNames = {};
            }
        },
        'singleDirectionTune': {
            writable: false,
            enumerable: false,
            value: function (mover, rectArray, direction) {
                if (this.intersector.isAccepted(direction)) {
                    this.initialize(direction);
                    this.placedNames[mover.id] = true;
                    this.placed.push(mover);
                    for (var i = 0, rect; rect = rectArray[i]; i++) {
                        if (rect.id != mover.id) {
                            if (mover.intersect(rect)) {
                                if (direction == this.intersector.getDirection(rect)) {
                                    rect.pristine = false;
                                    this.displaced.push(rect)
                                }
                            } else {
                                if (this.compare(mover, rect) >= 0) {
                                    this.displaced.push(rect);
                                }
                            }
                        }
                    }
                    this.placeInDirection(direction);
                }
            }
        },
        'placeInDirection': {
            writable: false,
            enumerable: false,
            value: function (direction) {
                this.displaced.sort(GeoRect.comparatorByDirection(Direction.opposite(direction)));
                for (var i = 0, displaced; displaced = this.displaced[i]; i++) {
                    this.placeRect(displaced, direction);
                }
            }
        },
        'placeRect': {
            writable: false,
            enumerable: false,
            value: function (rect, direction) {
                var border = rect.getOppositeSide(direction);
                for (var i = 0, placed; placed = this.placed[i]; i++) {
                    if (rect.intersect(placed)) {
                        rect.pristine = false;
                        rect.moveBy(direction, placed);
                    }
                }
                if (this.placedNames[rect.id] == undefined) {
                    this.placedNames[rect.id] = true;
                    this.placed.push(rect);
                }
                this.maxArea.max(rect);
                var placedRect;
                while (placedRect = this.placed[0]) {
                    if (this.compareSide(placedRect, border) < 0) {
                        placedRect.pristine = false;
                        this.placed.shift();
                    } else {
                        break;
                    }
                }

            }
        },
        'multiDirectionTune': {
            writable: false,
            enumerable: false,
            value: function (mover, rectArray, directionArray) {
                for (var i = 0, direction; direction = directionArray[i]; i++) {
                    this.singleDirectionTune(mover, rectArray, direction);
                }
            }
        },
        'tuneIt': {
            writable: false,
            enumerable: false,
            value: function (mover, rectArray, directionArray) {
                this.maxArea.copy(mover);
                this.multiDirectionTune(mover, rectArray, directionArray);
                return rectArray;
            }
        },
        'oversizeRect': {
            writable: false,
            enumerable: false,
            value: function (container) {
                return {
                    top: (this.maxArea.top <= container.top) ? container.top - this.maxArea.top : 0,
                    bottom: (this.maxArea.bottom >= container.bottom) ? container.bottom - this.maxArea.bottom : 0,
                    left: (this.maxArea.left <= container.left) ? container.left - this.maxArea.left : 0,
                    right: (this.maxArea.right >= container.right) ? container.right - this.maxArea.right : 0
                };
            }
        },
        'computeLayoutResize': {
            writable: false,
            enumerable: false,
            value: function (resizer, container, direction) {
                this.intersector = this.chooseIntersectorForResize(resizer, container, direction);
                var directionArray = [Direction.LEFT, Direction.TOP, Direction.RIGHT, Direction.BOTTOM],//Direction.getHardDirections(direction),
                    rectArray = this.tuneIt(resizer, container.getChildrenCopy(), directionArray);
                if (container.include(this.maxArea) && resizer.isValid()) {
                    container.children = rectArray;
                    return 1;
                }
                var fix = this.oversizeRect(container);

                if ((fix.top | fix.bottom | fix.left | fix.right) != 0) {
                    Direction.callByDirection(direction,
                        function () {
                            resizer.left += fix.left;
                        },
                        function () {
                            resizer.top += fix.top;
                        },
                        function () {
                            resizer.right += fix.right;
                        },
                        function () {
                            resizer.bottom += fix.bottom;
                        });


                    rectArray = this.tuneIt(resizer, container.getChildrenCopy(), directionArray);
                    if (container.include(this.maxArea) && resizer.isValid()) {
                        container.children = rectArray;
                        return 1;
                    }

                }
                return 0;
            }
        },
        'computeLayoutMove': {
            writable: false,
            enumerable: false,
            value: function (mover, container) {
                var directionArray = [Direction.LEFT, Direction.TOP, Direction.RIGHT, Direction.BOTTOM];
                this.intersector = this.chooseIntersectorForMove(mover, container);
                var original = container.getChildCopy(mover.id),
                    rectArray = this.tuneIt(mover, container.getChildrenCopy(), directionArray);

                if (container.include(this.maxArea) && mover.isValid()) {
                    container.children = rectArray;
                    return 1;
                }

                var fix = this.oversizeRect(container),
                    copy = mover.getCopy();

                if ((fix.top | fix.bottom | fix.left | fix.right) != 0) {
                    var deltaX = fix.left + fix.right,
                        deltaY = fix.top + fix.bottom;
                    mover.move(deltaX, deltaY);

                    rectArray = this.tuneIt(mover, container.getChildrenCopy(), directionArray);

                    if (container.include(this.maxArea) && mover.isValid()) {
                        container.children = rectArray;
                        return 1;
                    }
                    var afterFix = this.oversizeRect(container);

                    if ((afterFix.top | afterFix.bottom | afterFix.left | afterFix.right) != 0) {

                        var afterDeltaX = afterFix.left + afterFix.right,
                            afterDeltaY = afterFix.top + afterFix.bottom,
                            afterCopy = mover.getCopy();
                        mover.move(afterDeltaX, afterDeltaY);
                        rectArray = this.tuneIt(mover, container.getChildrenCopy(), directionArray);

                        if (container.include(this.maxArea) && mover.isValid()) {
                            container.children = rectArray;
                            return 1;
                        }

                        mover.copy(afterCopy);

                        if (afterFix.top != 0 && fix.top == 0) {
                            mover.top += afterFix.top;
                        }
                        if (afterFix.bottom != 0 && fix.bottom == 0) {
                            mover.bottom += afterFix.bottom;
                        }
                        if (afterFix.left != 0 && fix.left == 0) {
                            mover.left += afterFix.left;
                        }
                        if (afterFix.right != 0 && fix.right == 0) {
                            mover.right += afterFix.right;
                        }

                        rectArray = this.tuneIt(mover, container.getChildrenCopy(), directionArray);

                        if (container.include(this.maxArea) && mover.isValid()) {
                            container.children = rectArray;
                            return 3;
                        }
                    }
                    mover.copy(copy);

                }
                var verticalVector = fix.top != 0 && fix.bottom != 0,
                    horizontalVector = fix.left != 0 && fix.right != 0;
                if (verticalVector || horizontalVector) {
                    if (verticalVector) {
                        mover.top += fix.top;
                        mover.bottom += fix.bottom;
                    }
                    if (horizontalVector) {
                        mover.left += fix.left;
                        mover.right += fix.right;
                    }
                    rectArray = this.tuneIt(mover, container.getChildrenCopy(), directionArray);
                    if (container.include(this.maxArea) && mover.isValid()) {
                        container.children = rectArray;
                        return 2;
                    }

                    mover.copy(copy);
                }
                if (original) {
                    var dominant = GeoRect.getDominantDirection(original, mover);
                    this.intersector = new GeoIntersectMono(dominant);
                    rectArray = this.tuneIt(mover, container.getChildrenCopy(), [dominant]);

                    if (container.include(this.maxArea) && mover.isValid()) {
                        container.children = rectArray;
                        return 4;
                    }
                }

                return 0;

            }
        }
    });

    return GeoSweeper;
})();
