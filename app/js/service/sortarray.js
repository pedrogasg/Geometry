var SortArray;
SortArray = (function () {
    function SortArray(compare){
        this.compare = compare;
    }

    SortArray.prototype = Object.create([],{
        'unshift': {
            writable:false,
            enumerable:false,
            value:function (element) {
                var i = 0,internalElement = this[i];
                while(internalElement && this.compare(element,internalElement) > 0){
                    internalElement = this[++i];
                }
                this.splice.call(this,i,0,element);
                return this.length;
            }
        },
        'push': {
            writable:false,
            enumerable:false,
            value:function (element) {
                var i = this.length,internalElement = this[i-1];
                while(internalElement && this.compare(element,internalElement) < 0){
                    internalElement = this[--i];
                }
                this.splice.call(this,i,0,element);
                return this.length;
            }
        }

    });
    return SortArray;
})();
