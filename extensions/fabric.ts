/// <reference path="../typings/index.d.ts" />

(() => {

fabric.Canvas.prototype.getObject = function(id) {
    var object = null,
    objects = this.getObjects();
    for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i]['data'] && objects[i]['data']['id'] === id) {
            object = objects[i];
            break;
        }
    }
    return object;
};

fabric.Canvas.prototype.getItemByAttr = function(attr, name) {
    var object = null,
    objects = this.getObjects();
    for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i][attr] && objects[i][attr] === name) {
            object = objects[i];
            break;
        }
    }
    return object;
};

fabric.Object.prototype.getId = function() {
    var id = null;
    if(this.data) {
        id = this.data['id'] ? this.data['id'] :
            this.data['Id'] ? this.data['Id'] :
            this.data['ID'] ? this.data['ID'] : null;
    } 
    return id;
}

fabric.Object.prototype.getName = function() {
    var name = null;
    if(this.data) {
        name = this.data['name'] ? this.data['name'] :
            this.data['Name'] ? this.data['Name'] : null;
    } 
    return name;
}})();