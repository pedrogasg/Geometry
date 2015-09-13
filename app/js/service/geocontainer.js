var GeoContainer;
GeoContainer = (function () {
     /**
      *
      * @param {GeoRect} geoRect
      * @param {GeoRect[]} children
      * @returns {GeoContainer}
      * @constructor
      */
     function GeoContainer(geoRect, children){
          GeoRect.call(this, geoRect.id, geoRect.left, geoRect.top, geoRect.right, geoRect.bottom);
          this.children = children || [];
     }

     GeoContainer.prototype = Object.create(GeoRect.prototype,{
          'getCopy':{
               writable:false,
               enumerable:false,
               value:function(){
                    return new GeoContainer(GeoRect.prototype.getCopy.call(this),this.getChildrenCopy());
               }
          },
          'getChildrenCopy':{
               writable:false,
               enumerable:false,
               value:function(){
                    return this.children.map(function (x) {
                         return x.getCopy();
                    })
               }
          },
          'getChildCopy':{
               writable:false,
               enumerable:false,
               value:function (id) {
                    for(var i = 0,child;child = this.children[i]; i++){
                         if(child.id == id){
                              return child.getCopy();
                         }
                    }
               }
          },
          'addChild':{
               writable:false,
               enumerable:false,
               value:function (child) {
                    return this.children.push(child);
               }
          },
          'setNewSize':{
               writable:false,
               enumerable:false,
               value:function (geoRect) {
                    this.copy(geoRect);
               }
          },
          'removeChild':{
              writable:false,
              enumerable:false,
              value:function(id){
                   var children = this.children;
                   for(var i = 0;children[i].id != id;i++);
                   children.splice(i,1)[0];
              }
          },
          'toJSON':{
              writable:false,
              enumerable:false,
              value:function () {
                   return [GeoRect.prototype.getCopy.call(this),this.children,this.constructor.name];
              }
          },
          'toString':{
              writable:true,
              enumerable:true,
              value:function(){
                   var self = this, children = ["["];
                   self.children.forEach(function (x, i) {
                        children.push(x.toString());
                        if(i != self.children.length-1) children.push(", ");
                   });
                   children.push("]");
                   return ["[id: ",this.id,",left: ",this.left,",top: ",this.top,",right: ",this.right,",bottom: ",this.bottom,",children: ",children.join("")," ",this.constructor.name+"]"].join("");
              }
          }
     });

     GeoContainer.prototype.constructor = GeoContainer;

     return GeoContainer;
})();