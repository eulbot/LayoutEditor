module mapp.le {

    export class EditorObject implements ISerializable<IEditorObjectData> {

        public id: KnockoutObservable<number>;
        public name: KnockoutObservable<string>;
        public object: fabric.IObject;

        public width: Dimension;
        public height: Dimension;
        public top: Dimension; 
        public right: Dimension; 
        public bottom: Dimension; 
        public left: Dimension;

        private prioX: KnockoutObservableArray<enums.Dimension>;
        private prioY: KnockoutObservableArray<enums.Dimension>;
        public setPrio: (dimension: enums.Dimension, resize?: boolean) => void;
        public getPrio: (dimension: enums.Dimension) => enums.Dimension;
        public hasPrio: (dimension: enums.Dimension) => boolean;
        public isSlave: (dimension: enums.Dimension) => boolean;
        public isLatestPrio: (dimension: enums.Dimension) => boolean;
        public clearPrio: () => void;
        public unlock: (dimension?: enums.Dimension) => void;

        public apply: (object: fabric.IObject) => void;
        public applyDimensionValue: (dimension: enums.Dimension, value: number) => void;
        public applyDimensionProperties: (dimension: enums.Dimension, properties: IDimensionData) => void;
        public reapply: (horizontal?: boolean) => void;

        public update: (reapply?: boolean) => void;
        public resize: () => void;
        private init: () => void;
        private updating: boolean;
        public resizing: boolean;

        protected attributes: KnockoutObservableArray<Attribute<any>>;

        constructor() {            

            this.id = ko.observable<number>();
            this.name = ko.observable<string>();
            
            this.width = new Dimension(Util.canvasWidth);
            this.width.isLocked(true);
            this.height = new Dimension(Util.canvasHeight);
            this.height.isLocked(true);

            this.top = new Dimension(Util.canvasHeight);
            this.right = new Dimension(Util.canvasWidth);
            this.bottom = new Dimension(Util.canvasHeight);
            this.left = new Dimension(Util.canvasWidth);
            this.attributes = ko.observableArray<Attribute<any>>();
            this.attributes.push(new Attribute<string>(this.name, 'Name', enums.AttributeTemplates.INPUT));

            this.prioX = ko.observableArray<enums.Dimension>();
            this.prioY = ko.observableArray<enums.Dimension>();

            this.updating = false;

            this.apply = (object: fabric.IObject) => {

                this.object = object;
                this.update(); 
            }

            this.applyDimensionValue = (dimension: enums.Dimension, value: number) => {

                if(this.object && !this.updating) {

                    if (Util.isHorizontal(dimension)) 
                        this.object.set('scaleX', 1);
                    if (!Util.isHorizontal(dimension)) 
                        this.object.set('scaleY', 1);

                    var oldValue = this.getOldValue(dimension);

                    if(!isNaN(value) && value !== oldValue) {

                        if(dimension == enums.Dimension.Width) {
                            this.applyWidth(value);
                        }
                        else if(dimension == enums.Dimension.Height) {
                            this.applyHeight(value);
                        }
                        else if(dimension == enums.Dimension.Top) {
                            this.applyTop(value);
                        }
                        else if(dimension == enums.Dimension.Right) {
                            this.applyRight(value);
                        }
                        else if(dimension == enums.Dimension.Bottom) {
                            this.applyBottom(value);
                        }
                        else if(dimension == enums.Dimension.Left) {
                            this.applyLeft(value);
                        }
                        
                        this.object.setCoords();
                        Util.canvas.renderAll();
                        this.update();
                    }
                }
            }

            this.applyDimensionProperties = (dimension: enums.Dimension, properties: IDimensionData) => {

                if(!this.updating) {
                    this.object.setData(enums.Dimension[dimension], properties);
                }
            }

            this.reapply = (horizontal?: boolean) => {

                this.updating = true;

                if (horizontal == undefined || horizontal === true) {
                    this.object.set('scaleX', 1);
                    this.object.setLeft(this.left.value());
                    this.object.setWidth(this.width.value());
                }

                if (horizontal == undefined || horizontal === false) {
                    this.object.set('scaleY', 1);
                    this.object.setTop(this.top.value());
                    this.object.setHeight(this.height.value());
                }

                this.updating = false;
            }

            this.update = () => {

                this.updating = true;

                if(this.width.value() !== this.object.getWidth()) {
                    this.width.value(this.object.getWidth());
                }
                if(this.height.value() !== this.object.getHeight()) {
                    this.height.value(this.object.getHeight());
                }
                if(this.top.value() !== this.object.getTop()) {
                    this.top.value(this.object.getTop());
                }
                if(this.left.value() !== this.object.getLeft()) {
                    this.left.value(this.object.getLeft());
                }

                let difRight = Util.canvas.getWidth() - this.object.getLeft() - this.object.getWidth();
                if(this.right.value() !== difRight) {
                    this.right.value(difRight);
                }
                
                let difBottom = Util.canvas.getHeight() - this.object.getTop() - this.object.getHeight();
                if(this.bottom.value() !== difBottom) {
                    this.bottom.value(difBottom);
                }

                this.updating = false;
            }
            
            this.setPrio = (dimension: enums.Dimension, resize?: boolean) => {
                if(Util.isHorizontal(dimension) && this.prioX()[0] != dimension)
                    this.prioX.unshift(dimension);
                else if(!(Util.isHorizontal(dimension)) && this.prioY()[0] != dimension)
                    this.prioY.unshift(dimension);

                if(this.prioX().length > 2) 
                    this.prioX(this.prioX().slice(0, 2));

                if(this.prioY().length > 2) 
                    this.prioY(this.prioY().slice(0, 2));

                // this.getDimension(dimension).isLocked(true);

                // if(this.getDimension(Util.getOppositeDimension(dimension)).isLocked()) {
                //     if(Util.isHorizontal(dimension))
                //         this.width.isLocked(false);
                //     else
                //         this.height.isLocked(false);
                // }
            }

            this.getPrio = (dimension: enums.Dimension) => {

                if(Util.isHorizontal(dimension)) {
                    if(this.prioX()[0] != dimension) return this.prioX()[0];
                    else if(this.prioX()[1] != dimension) return this.prioX()[1];
                }
                else if (!(Util.isHorizontal(dimension))) {
                    if(this.prioY()[0] != dimension) return this.prioY()[0];
                    else if(this.prioY()[1] != dimension) return this.prioY()[1];
                }
                
                return 0;
            }

            this.hasPrio = (dimension: enums.Dimension) => {

                if(Util.isHorizontal(dimension) && $.inArray(dimension, this.prioX()) >= 0)
                    return true;
                if(!(Util.isHorizontal(dimension)) && $.inArray(dimension, this.prioY()) >= 0)
                    return true;

                return false;
            }

            this.isSlave = (dimension: enums.Dimension) => {

                if(Util.isHorizontal(dimension) && this.prioX().length == 2 && $.inArray(dimension, this.prioX()) < 0)
                    return true;
                if(!(Util.isHorizontal(dimension)) && this.prioY().length == 2 && $.inArray(dimension, this.prioY()) < 0)
                    return true;

                return false;
            }

            this.clearPrio = () => {
                this.prioX.removeAll();
                this.prioY.removeAll();
            }

            this.unlock = (dimension?: enums.Dimension) => {

                if(dimension)
                    this.getDimension(dimension).isLocked(false)
                else {
                    this.top.isLocked(false);
                    this.right.isLocked(false);
                    this.bottom.isLocked(false);
                    this.left.isLocked(false);
                }
            }

            this.init = () => {

                this.width.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Width, value); });
                this.height.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Height, value); });
                this.top.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Top, value); });
                this.right.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Right, value); });
                this.bottom.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Bottom, value);});
                this.left.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Left, value);});
            }
            
            this.init();
        }

        public snaptTo(arg: number | EditorObject, edge: enums.Dimension, inside?: boolean) {

            let element: EditorObject;
            let value: number;

            if(typeof arg != 'number') 
                element = arg;
            else
                value = arg;

            switch(edge) {
                case enums.Dimension.Top: 
                    element ? this.top.getValue().deserialize(inside ? element.top.getValue().serialize() : 
                        Util.addDimensionValues(element.top.getValue(), element.height.getValue())) : this.top.value(value);
                    break;
                case enums.Dimension.Right: 
                    element ? this.right.getValue().deserialize(inside ? element.right.getValue().serialize() : 
                        Util.addDimensionValues(element.right.getValue(), element.width.getValue())) : this.right.value(value);
                    break;
                case enums.Dimension.Bottom: 
                    element ? this.bottom.getValue().deserialize(inside ? element.bottom.getValue().serialize() : 
                        Util.addDimensionValues(element.bottom.getValue(), element.height.getValue())) : this.bottom.value(value);
                    break;
                case enums.Dimension.Left: 
                    element ? this.left.getValue().deserialize(inside ? element.left.getValue().serialize() : 
                        Util.addDimensionValues(element.left.getValue(), element.width.getValue())) : this.left.value(value);
                    break;
            }

            this.getDimension(edge).isLocked(true);
        }

        private getOldValue(dimension: enums.Dimension) {

            switch(dimension) {
                case enums.Dimension.Width:
                    return Math.round(this.object.getWidth());
                case enums.Dimension.Height:
                    return Math.round(this.object.getHeight());
                case enums.Dimension.Top:
                    return Math.round(this.object.getTop());
                case enums.Dimension.Right:
                    return Math.round(Util.canvas.getWidth() - this.object.getRight());
                case enums.Dimension.Bottom:
                    return Math.round(Util.canvas.getHeight() - this.object.getBottom());
                case enums.Dimension.Left:
                    return Math.round(this.object.getLeft());
            }
        }

        public toggleLock(ed: enums.Dimension) {

            let dimension = this.getDimension(ed);

            if(dimension.isLocked()) {
                dimension.solve();
                dimension.isLocked(false);
            }
            else
                dimension.isLocked(true);
        }

        public widthComputed() {
            return this.left.isLocked() && this.right.isLocked();
        }

        public heightComputed() {
            return this.top.isLocked() && this.bottom.isLocked();
        }

        private applyWidth(value: number) {
            console.info('-- WIDTH --');
            let oldValue = this.object.getWidth();
            Util.log("Width applied: ", oldValue + ' --> ' + value);
            this.object.setWidth(value);

            if(this.getPrio(enums.Dimension.Width) == enums.Dimension.Right) {
                oldValue = this.object.getLeft();
                let newValue = Util.canvas.getWidth() - value - this.right.value();
                Util.log("Object docked right, left applied: ", oldValue + ' --> ' + newValue);
                this.object.setLeft(newValue);
                
            }
        }

        private applyHeight(value: number) {
            console.info('-- HEIGHT --');
            let oldValue = this.object.getHeight();
            Util.log("Height applied: ", oldValue + ' --> ' + value);
            this.object.setHeight(value);

            if(this.getPrio(enums.Dimension.Height) == enums.Dimension.Bottom) {
                oldValue = this.object.getTop();
                let newValue = (Util.canvas.getHeight() - value - this.bottom.value());
                Util.log("Object docked bottom, top applied: ", oldValue + ' --> ' + newValue);
                this.object.setTop(newValue);
            }
        }

        private applyTop(value: number) {
            console.info('-- TOP --');
            let oldValue = this.object.getTop();
            Util.log("Top applied: ", oldValue + ' --> ' + value);
            this.object.setTop(value);

            if(this.getPrio(enums.Dimension.Top) == enums.Dimension.Bottom) {
                oldValue = this.object.getHeight();
                let newValue = Util.canvas.getHeight() - value - this.bottom.value();
                Util.log("Object docked bottom, height applied: ", oldValue + ' --> ' + newValue);
                this.object.setHeight(newValue);
            }
        }

        private applyRight(value: number) {
            console.info('-- RIGHT --');

            if(this.getPrio(enums.Dimension.Right) == enums.Dimension.Left) {
                let oldValue = this.object.getWidth();
                let newValue = Util.canvas.getWidth() - value - this.left.value();
                Util.log("Object docked left, width applied: ", oldValue + ' --> ' + newValue);
                this.width.value(newValue);
                this.object.setWidth(newValue);
            }
            else {
                let oldValue = this.object.getLeft();
                let newValue = Util.canvasWidth() - value - this.object.getWidth();
                Util.log("Object width set, left applied: ", oldValue + ' --> ' + newValue);
                this.left.value(newValue);
                this.object.setLeft(newValue);
            }
        }

        private applyBottom(value: number) {
            console.info('-- BOTTOM --');
            
            if(this.getPrio(enums.Dimension.Bottom) == enums.Dimension.Top) {
                let oldValue = this.object.getHeight();
                let newValue = Util.canvas.getHeight() - value - this.top.value();
                Util.log("Object docked top, height applied: ", oldValue + ' --> ' + newValue);
                this.height.value(newValue);
                this.object.setHeight(newValue);
            }
            else {
                let oldValue = this.object.getTop();
                let newValue = Util.canvasHeight() - value - this.object.getHeight();
                Util.log("Object top set, top applied: ", oldValue + ' --> ' + newValue);
                this.top.value(newValue);
                this.object.setTop(newValue);
            }
        }

        private applyLeft(value: number) {
            console.info('-- LEFT --');
            let oldValue = this.object.getLeft();
            Util.log("Left applied: ", oldValue + ' --> ' + value);
            this.object.setLeft(value);

            if(this.getPrio(enums.Dimension.Left) == enums.Dimension.Right) {
                oldValue = this.object.getWidth();
                let newValue = Util.canvas.getWidth() - value - this.right.value();
                Util.log("Object docked right, width applied: ", oldValue + ' --> ' + newValue);
                this.object.setWidth(newValue);
            }
        }

        private getDimension(dimension: enums.Dimension): Dimension {
            switch(dimension) {
                case enums.Dimension.Width:
                    return this.width;
                case enums.Dimension.Height:
                    return this.height;
                case enums.Dimension.Top:
                    return this.top;
                case enums.Dimension.Right:
                    return this.right;
                case enums.Dimension.Bottom:
                    return this.bottom;
                case enums.Dimension.Left:
                    return this.left;
                
            }
        }

        public serialize(): IEditorObjectData {
            return {
                type: undefined,
                id: this.id(),
                name: this.name(),
                object: JSON.stringify(this.object),
                width: this.width.serialize(),
                height: this.height.serialize(),
                top: this.top.serialize(),
                right: this.right.serialize(),
                bottom: this.bottom.serialize(),
                left: this.left.serialize()
            }
        }

        public deserialize (editorObjectData: IEditorObjectData) {
            this.id(editorObjectData.id);
            this.name(editorObjectData.name);
            this.width.deserialize(editorObjectData.width);
            this.height.deserialize(editorObjectData.height);
            this.top.deserialize(editorObjectData.top);
            this.right.deserialize(editorObjectData.right);
            this.bottom.deserialize(editorObjectData.bottom);
            this.left.deserialize(editorObjectData.left);

        }

        public static newInstance (type: enums.ElementType) {
            let result: EditorObject = undefined;

            switch(type) {
                // case enums.ElementType.FRAME:
                //     result = new Frame();
                //     break;
                case enums.ElementType.IMAGE:
                    result = new Image();
                    break;
                case enums.ElementType.TEXTBOX:
                    result = new TextBox();
                    break;
            }

            return result;
        }
    }
}