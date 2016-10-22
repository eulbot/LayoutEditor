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
    
    fabric.Object.prototype.setData = function(key, value) {
        this.data[key] || (this.data[key] = {});
        this.data[key] = value;
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

    fabric.Object.prototype.withinX = function(ref, threshold, inside) {
        if(inside) 
            return this.getLeft() + threshold > ref.getLeft() && this.getRight() - threshold < ref.getRight();
        else
            return (this.getLeft() < ref.getRight() + threshold && this.getLeft() > ref.getLeft() - threshold) 
                || (this.getRight() > ref.getLeft() - threshold && this.getRight() < ref.getRight() + threshold);
    }

    fabric.Object.prototype.withinY = function(ref, threshold, inside) {
        if(inside) 
            return this.getTop() + threshold > ref.getTop() && this.getBottom() - threshold < ref.getBottom();
        else {
            return (this.getTop() < ref.getBottom() + threshold && this.getTop() > ref.getTop() - threshold)  
                || (this.getBottom() > ref.getTop() - threshold && this.getBottom() < ref.getBottom() + threshold);
        }
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

    fabric.Object.prototype.isDimensionLocked = function(dimension: number) {

        switch(dimension) {
            case(0):
                return this.data ? this.data['Width'] ? this.data['Width']['isLocked'] : false : false;
            case(1):
                return this.data ? this.data['Height'] ? this.data['Height']['isLocked'] : false : false;
            case(2):
                return this.data ? this.data['Top'] ? this.data['Top']['isLocked'] : false : false;
            case(3):
                return this.data ? this.data['Right'] ? this.data['Right']['isLocked'] : false : false;
            case(4):
                return this.data ? this.data['Bottom'] ? this.data['Bottom']['isLocked'] : false : false;
            case(5):
                return this.data ? this.data['Left'] ? this.data['Left']['isLocked'] : false : false;
        }
    }

})();