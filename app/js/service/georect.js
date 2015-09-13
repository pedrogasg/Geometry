var GeoRect;
GeoRect = (function () {
    /**
     *
     * @param {string} id
     * @param {number} left
     * @param {number} top
     * @param {number} right
     * @param {number} bottom
     * @returns {GeoRect}
     * @constructor
     */
    function GeoRect(id, left, top, right, bottom) {
        if(Array.isArray(id)){
            var params = id;
            return new GeoRect(params[0],params[1],params[2],params[3],params[4]);
        }
        Object.defineProperties(this, {
            'id': {
                value:id,
                writable: false
            },
            'left': {
                get: function () {
                    return left;
                },
                set: function (value) {
                    left=value;
                }
            },
            'top': {
                get: function () {
                    return top;
                },
                set: function (value) {
                    top=value;
                }
            },
            'right': {
                get: function () {
                    return right;
                },
                set: function (value) {
                    right=value;
                }
            },
            'bottom': {
                get: function () {
                    return bottom;
                },
                set: function (value) {
                    bottom=value;
                }
            },
            'x':{
                get: function () {
                    return (left + right)/2;
                },
                set: function (value) {
                    var diff = value - this.x;
                    left = left + diff;
                    right = right + diff;
                }
            },
            'y':{
                get: function () {
                    return (bottom + top)/2;
                },
                set: function (value) {
                    var diff = value - this.y;
                    top = top + diff;
                    bottom = bottom + diff;
                }
            },
            'height':{
                get: function () {
                    return bottom - top;
                },
                set: function (value) {
                    var diff = value - this.height;
                    bottom = bottom + diff;
                }
            },
            'width':{
                get: function () {
                    return right - left;
                },
                set: function (value) {
                    var diff = value - this.width;
                    right = right + diff;
                }
            },
            'pristine': {
                value:true,
                writable: true
            }
        });
    }
    var geoProto = GeoRect.prototype;
    Object.defineProperties(GeoRect.prototype, {
        'copy': {
            writable: false,
            enumerable: false,
            value: function (otherRect) {
                this.left = otherRect.left;
                this.top = otherRect.top;
                this.right = otherRect.right;
                this.bottom = otherRect.bottom;
            }
        },
        'getCopy': {
            writable: false,
            enumerable: false,
            value: function () {
                var geoRect = new GeoRect(this.id, this.left, this.top, this.right, this.bottom);
                geoRect.pristine = this.pristine;
                return geoRect;
            }
        },
        'move': {
            writable: false,
            enumerable: false,
            value: function (x, y) {
                this.left += x;
                this.top += y;
                this.right += x;
                this.bottom += y;
            }
        },
        'moveBy': {
            writable: false,
            enumerable: false,
            value: function (direction, rectToAvoid) {
                var self = this;
                return Direction.returnByDirection(direction,
                    function () {
                        self.left += -self.right + rectToAvoid.left - 1;
                        self.right = rectToAvoid.left - 1;
                    },
                    function () {
                        self.top += -self.bottom + rectToAvoid.top - 1;
                        self.bottom = rectToAvoid.top - 1;

                    },
                    function () {
                        self.right += -self.left + rectToAvoid.right + 1;
                        self.left = rectToAvoid.right + 1;
                    },
                    function () {
                        self.bottom += -self.top + rectToAvoid.bottom + 1;
                        self.top = rectToAvoid.bottom + 1;
                    });
            }
        },
        'snapBy': {
            writable: false,
            enumerable: false,
            value: function (direction, rectToSnap) {
                var self = this;
                return Direction.returnByDirection(direction,
                    function () {
                        return self.left = rectToSnap.left - 1;
                    },
                    function () {
                        return self.top = rectToSnap.top - 1;
                    },
                    function () {
                        return self.right = rectToSnap.right + 1;
                    },
                    function () {
                        return self.bottom = rectToSnap.bottom + 1;
                    });
            }
        },
        'getSide': {
            writable: false,
            enumerable: false,
            value: function (direction) {
                var self = this;
                return Direction.returnByDirection(direction,
                    function () {
                        return self.left;
                    },
                    function () {
                        return self.top;
                    },
                    function () {
                        return self.right;
                    },
                    function () {
                        return self.bottom;
                    });
            }
        },
        'getOppositeSide': {
            writable: false,
            enumerable: false,
            value: function (direction) {
                return this.getSide(Direction.opposite(direction));
            }
        },
        'intersect': {
            writable: false,
            enumerable: false,
            value: function (other) {
                return this.left <= other.right && this.right >= other.left && this.top <= other.bottom && this.bottom >= other.top;
            }
        },
        'include': {
            writable: false,
            enumerable: false,
            value: function (other) {
                return this.top <= other.top && this.bottom >= other.bottom && this.left <= other.left && this.right >= other.right
            }
        },
        'max': {
            writable: false,
            enumerable: false,
            value: function (other) {
                if (other.top < this.top) {
                    this.top = other.top;
                }
                if (other.bottom > this.bottom) {
                    this.bottom = other.bottom;
                }
                if (other.left < this.left) {
                    this.left = other.left;
                }
                if (other.right > this.right) {
                    this.right = other.right;
                }
            }
        },
        'isValid': {
            writable: false,
            enumerable: false,
            value: function () {
                //return this.top <= this.bottom && this.left <= this.right;
                return this.bottom - this.top >= 50 && this.right - this.left >= 50;
            }
        },
        'isInstance': {
            writable: false,
            enumerable: false,
            value: function (someRect) {
                return someRect instanceof this.constructor;
            }
        },
        'toJSON': {
            writable: false,
            enumerable: false,
            value: function () {
                return {
                    'id': this.id,
                    'left': this.left,
                    'top': this.top,
                    'right': this.right,
                    'bottom': this.bottom
                };
                //return [this.id,this.left,this.top,this.right,this.bottom,this.constructor.name];
            }
        },
        'toString': {
            writable: false,
            enumerable: false,
            value: function () {
                return ["[id: ", this.id, ",left: ", this.left, ",top: ", this.top, ",right: ", this.right, ",bottom: ", this.bottom, " ", this.constructor.name + "]"].join("");
            }
        },
        'comparatorByDirection': {
            writable: false,
            enumerable: false,
            value: function (direction) {
                return Direction.returnByDirection(direction,
                    function () {
                        return function (rect1, rect2) {
                            return rect1.left - rect2.left;
                        };
                    },
                    function () {
                        return function (rect1, rect2) {
                            return rect1.top - rect2.top;
                        };
                    },
                    function () {
                        return function (rect1, rect2) {
                            return -(rect1.right - rect2.right);
                        };
                    },
                    function () {
                        return function (rect1, rect2) {
                            return -(rect1.bottom - rect2.bottom);
                        };
                    });
            }
        },
        'comparatorByDirectionInverse': {
            writable: false,
            enumerable: false,
            value: function (direction) {
                return Direction.returnByDirection(direction,
                    function () {
                        return function (rect1, rect2) {
                            return -(rect1.left - rect2.left);
                        };
                    },
                    function () {
                        return function (rect1, rect2) {
                            return -(rect1.top - rect2.top);
                        };
                    },
                    function () {
                        return function (rect1, rect2) {
                            return rect1.right - rect2.right;
                        };
                    },
                    function () {
                        return function (rect1, rect2) {
                            return rect1.bottom - rect2.bottom;
                        };
                    });
            }
        },
        'sideComparatorByDirection': {
            writable: false,
            enumerable: false,
            value: function (direction) {
                return Direction.returnByDirection(direction,
                    function () {
                        return function (rect, x) {
                            return -(rect.left - x);
                        };
                    },
                    function () {
                        return function (rect, x) {
                            return -(rect.top - x);
                        };
                    },
                    function () {
                        return function (rect, x) {
                            return rect.right - x;
                        };
                    },
                    function () {
                        return function (rect, x) {
                            return rect.bottom - x;
                        };
                    });
            }
        },
        'getDominantDirection': {
            writable: false,
            enumerable: false,
            value: function (original, moved) {
                var x = moved.left - original.left,
                    y = moved.top - original.top;

                if ((x > 0 ? x : -x) > (y > 0 ? y : -y))
                    return x > 0 ? Direction.RIGHT : Direction.LEFT;
                else
                    return y > 0 ? Direction.BOTTOM : Direction.TOP;
            }
        }
    });
    return GeoRect;
})();