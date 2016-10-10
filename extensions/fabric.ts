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
    }

    fabric.Object.prototype.getRight = function() {
        return this.getLeft() + this.getWidth();
    }

    fabric.Object.prototype.setRight = function(value) {
        this.setLeft(value - this.getWidth());
    }

    fabric.Object.prototype.getBottom = function() {
        return this.getTop() + this.getHeight();
    }

    fabric.Object.prototype.setBottom = function(value) {
        this.setTop(value - this.getHeight());
    }

    fabric.Object.prototype.withinX = function(ref, threshold) {
        return this.getLeft() + threshold > ref.getLeft() && this.getRight() - threshold < ref.getRight();
    }

    fabric.Object.prototype.withinY = function(ref, threshold) {
        return this.getTop() + threshold > ref.getTop() && this.getBottom() - threshold < ref.getBottom();
    }

    fabric.Object.prototype.snapTop = function(ref, threshold, inside) {
        return Math.abs(this.getTop() - (inside ? ref.getTop() : ref.getBottom())) < threshold;
    }

    fabric.Object.prototype.snapLeft = function(ref, threshold, inside) {

        return Math.abs(this.getLeft() - (inside ? ref.getLeft() : ref.getRight())) < threshold;
    }

    fabric.Object.prototype.snapRight = function(ref, threshold, inside) {
        return Math.abs(this.getRight() - (inside ? ref.getRight() : ref.getLeft())) < threshold;
    }

    fabric.Object.prototype.snapBottom = function(ref, threshold, inside) {
        return Math.abs(this.getBottom() - (inside ? ref.getBottom() : ref.getTop())) < threshold;
    }


})();