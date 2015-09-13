var GeoSnaper;
GeoSnaper = (function () {
     var SNAP_MINIMAL_MOVE = 15;
    function GeoSnaper(){

    }

    Object.defineProperties(GeoSnaper.prototype, {
        'getClosest': {
            writable: false,
            enumerable: false,
            value: function (witness, tries) {
                for (var i = 0, trie; trie = tries[i]; i++) {
                    if (Math.abs(trie) < Math.abs(witness)) {
                        witness = trie;
                    }
                }
                return witness
            }
        },
        'moveToClosest': {
            writable: false,
            enumerable: false,
            value: function (rect, container) {
                var x = this.getClosest(SNAP_MINIMAL_MOVE + 1, [container.right - rect.right, container.left - rect.left]),
                    y = this.getClosest(SNAP_MINIMAL_MOVE + 1, [container.bottom - rect.bottom, container.top - rect.top]),
                    children = container.children;
                for (var i = 0, child; child = children[i]; i++) {
                    if (child.id != rect.id) {
                        x = this.getClosest(x, [child.left - rect.left, child.right - rect.left + 1,
                            child.left - rect.right - 1, child.right - rect.right]);

                        y = this.getClosest(y, [child.top - rect.top, child.bottom - rect.top + 1,
                            child.top - rect.bottom - 1, child.bottom - rect.bottom]);
                    }
                }
                x = Math.abs(x) > SNAP_MINIMAL_MOVE ? 0 : x;
                y = Math.abs(y) > SNAP_MINIMAL_MOVE ? 0 : y;

                if ((x | y) != 0) {
                    rect.move(x, y);
                    return true;
                }
                return false;
            }
        },
        'resizeToClosest': {
            writable: false,
            enumerable: false,
            value: function (rect, container, direction) {
                var self = this,
                    left = 0,
                    top = 0,
                    right = 0,
                    bottom = 0,
                    children = container.children;

                Direction.callByDirection(direction,
                    function () {
                        left = self.getClosest(SNAP_MINIMAL_MOVE + 1, [container.left - rect.left]);
                    },
                    function () {
                        top = self.getClosest(SNAP_MINIMAL_MOVE + 1, [container.top - rect.top]);
                    },
                    function () {
                        right = self.getClosest(SNAP_MINIMAL_MOVE + 1, [container.right - rect.right]);
                    },
                    function () {
                        bottom = self.getClosest(SNAP_MINIMAL_MOVE + 1, [container.bottom - rect.bottom]);
                    });

                for (var i = 0, child; child = children[i]; i++) {
                    if (child.id != rect.id) {

                        Direction.callByDirection(direction,
                            function () {
                                left = self.getClosest(left, [child.left - rect.left, child.right - rect.left + 1]);
                            },
                            function () {
                                top = self.getClosest(top, [child.top - rect.top, child.bottom - rect.top + 1]);
                            },
                            function () {
                                right = self.getClosest(right, [child.left - rect.right - 1, child.right - rect.right]);
                            },
                            function () {
                                bottom = self.getClosest(bottom, [child.top - rect.bottom - 1, child.bottom - rect.bottom]);
                            });

                    }
                }
                top = Math.abs(top) > SNAP_MINIMAL_MOVE ? 0 : top;
                left = Math.abs(left) > SNAP_MINIMAL_MOVE ? 0 : left;
                bottom = Math.abs(bottom) > SNAP_MINIMAL_MOVE ? 0 : bottom;
                right = Math.abs(right) > SNAP_MINIMAL_MOVE ? 0 : right;

                if ((left | top | right | bottom) != 0) {
                    rect.left += left;
                    rect.top += top;
                    rect.right += right;
                    rect.bottom += bottom;
                    return true;
                }

                return false;


            }
        },
        'expand': {
            writable: false,
            enumerable: false,
            value: function (rect, container) {
                var left = container.left,
                    top = container.top,
                    right = container.right,
                    bottom = container.bottom,
                    children = container.children,
                    realChild = null;
                for (var i = 0, child; child = children[i]; i++) {
                    if (child.id != rect.id && child.top <= rect.bottom && child.bottom >= rect.top) {
                        if (child.right > left && child.right < rect.left) {
                            left = child.right + 1;
                        }
                        if (child.left < right && child.left > rect.right) {
                            right = child.left - 1;
                        }
                    }
                }
                rect.left = left;
                rect.right = right;

                for (var i = 0, child; child = children[i]; i++) {
                    if (child.id != rect.id && child.left <= rect.right && child.right >= rect.left) {
                        if (child.bottom > top && child.bottom < rect.top) {
                            top = child.bottom + 1;
                        }
                        if (child.top < bottom && child.top > rect.bottom) {
                            bottom = child.top - 1;
                        }
                    } else if (child.id == rect.id) {
                        realChild = child;
                    }

                }

                rect.top = top;
                rect.bottom = bottom;

                if (realChild) {
                    realChild.copy(rect);
                }

            }
        },
        'getSiblings': {
            writable: false,
            enumerable: false,
            value: function (container) {
                var children = container.getChildrenCopy(),
                    horizontal = [],
                    vertical = [];
                children.sort(GeoRect.comparatorByDirection(Direction.TOP));
                for (var i = 0, j = i + 1, childA; childA = children[i]; i++, j = i + 1) {
                    var childB = children[j];
                    while (childB && childA.top == childB.top && childA.bottom == childB.bottom) {
                        if (childA.right == childB.left - 1) {
                            horizontal.push({'a': childA.id, 'b': childB.id})
                        } else if (childA.left == childB.right + 1) {
                            horizontal.push({'b': childA.id, 'a': childB.id})
                        }
                        childB = children[++j];
                    }
                }
                children.sort(GeoRect.comparatorByDirection(Direction.LEFT));
                for (var i = 0, j = i + 1, childA; childA = children[i]; i++, j = i + 1) {
                    var childB = children[j];
                    while (childB && childA.left == childB.left && childA.right == childB.right) {
                        if (childA.bottom == childB.top - 1) {
                            vertical.push({'a': childA.id, 'b': childB.id})
                        } else if (childA.top == childB.bottom + 1) {
                            vertical.push({'b': childA.id, 'a': childB.id})
                        }
                        childB = children[++j];
                    }
                }

                return {'vertical': vertical, 'horizontal': horizontal};
            }
        }
    });

    return GeoSnaper;
})();
