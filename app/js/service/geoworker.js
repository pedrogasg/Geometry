importScripts('sortarray.js','commands.js','direction.js',
    'georect.js',
    'geocontainer.js',
    'geointersect.js',
    'geointersectmaindiagonal.js',
    'geointersectantidiagonal.js',
    'geointersectmono.js',
    'geointersecttrial.js',
    'geointersectresize.js',
    'geointersecttopleftbottomright.js',
    'geointersectbottomlefttopright.js',
    'geosweeper.js',
    'geosnaper.js',
    'geosweeperservice.js');


var proxy = {
        setChildPosition: function (rect, direction) {
            var data = rect.toJSON();
            if(direction){
                data['direction'] = direction;
            }
            data['command'] = Commands.SET_CHILD_POSITION;
            self.postMessage(data);
        },
        setPosition: function (geoRectArray) {
            var rectArray = [];
            for(var i = 0,rect;rect = geoRectArray[i];i++){
                rectArray.push(rect.toJSON());
            }

            self.postMessage({
                'command':Commands.SET_POSITION,
                'rectArray':rectArray
            });
        },
        removeChild: function (id) {
            self.postMessage({
                'command':Commands.REMOVE_CHILD,
                'id':id
            });
        },
        siblings: function (siblings) {
            siblings['command'] = Commands.SIBLINGS;
            self.postMessage(siblings);
        },
        log: function (val) {
            self.postMessage({
                'command':Commands.LOG,
                val:val
            })
        }
    },
    geoService = new GeoSweeperService(proxy);

function dataToGeoRect(data){
    return new GeoRect(data.id, data.left, data.top, data.right, data.bottom);
}

function dataToGeoContainer(data) {
    var geoChildren = [];
    if(data.children){
        for(var i = 0,child; child = data.children[i];i++){
            geoChildren.push(dataToGeoRect(child));
        }
    }
    return new GeoContainer(dataToGeoRect(data), geoChildren);
}
self.addEventListener('message', function(e) {
    var data = e.data;
    switch (data.command) {
        case Commands.MEMENTO:
            geoService.memento();
            break;
        case Commands.COMPUTE_LAYOUT_RESIZE:
            geoService.computeLayoutResize(dataToGeoRect(data),data.direction);
            break;
        case Commands.COMPUTE_LAYOUT_MOVE:
            geoService.computeLayoutMove(dataToGeoRect(data));
            break;
        case Commands.SET_CONTAINER:
            geoService.setContainer(dataToGeoContainer(data));
            break;
        case Commands.ADD_CHILD:
            geoService.addChild(dataToGeoRect(data));
            break;
        case Commands.EXPAND:
            geoService.expand(dataToGeoRect(data));
            break;
        case Commands.GET_SIBLINGS:
            geoService.getSiblings();
            break;
        case Commands.REMOVE_CHILDREN_IN_CONTAINER:
            geoService.removeChildrenInContainer(data.ids);
            break;
        case Commands.SAFE_STATE:
            geoService.safeState();
            break;
        default:
            break;
    }
}, false);