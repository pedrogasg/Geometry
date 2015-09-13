var Commands;
Commands = (function(){
    function Commands() {
        Object.defineProperties(this, {
            'MEMENTO': {
                value: 1,
                writable: false
            },
            'COMPUTE_LAYOUT_MOVE': {
                value: 2,
                writable: false
            },
            'COMPUTE_LAYOUT_RESIZE': {
                value: 3,
                writable: false
            },
            'SET_CONTAINER': {
                value: 4,
                writable: false
            },
            'ADD_CHILD': {
                value: 5,
                writable: false
            },
            'SAFE_STATE': {
                value: 6,
                writable: false
            },
            'SET_CHILD_POSITION':{
                value: 7,
                writable:false
            },
            'SET_POSITION':{
                value: 8,
                writable: false
            },
            'REMOVE_CHILD':{
                value: 9,
                writable:false
            },
            'EXPAND':{
                value: 10,
                writable:false
            },
            'SIBLINGS':{
                value: 11,
                writable:false
            },
            'GET_SIBLINGS':{
                value: 12,
                writable:false
            },
            "REMOVE_CHILDREN_IN_CONTAINER":{
                value: 13,
                writable:false
            },
            'LOG':{
                value: 14,
                writable:false
            }
        });
    }

    return new Commands();
})();