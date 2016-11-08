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
        //public clear: () => void;
        private init: () => void;
        private initSelectdProperties: () => void;
        private updating: boolean;
        public resizing: boolean;

        protected attributes: KnockoutObservableArray<Attribute<any>>;

        constructor() {            

            this.id = ko.observable<number>();
            this.name = ko.observable<string>();
            
            this.width = new Dimension(Util.getCanvasWidth);
            this.width.isLocked(true);
            this.height = new Dimension(Util.getCanvasHeight);
            this.height.isLocked(true);

            this.top = new Dimension(Util.getCanvasHeight);
            this.right = new Dimension(Util.getCanvasWidth);
            this.bottom = new Dimension(Util.getCanvasHeight);
            this.left = new Dimension(Util.getCanvasWidth);
            this.attributes = ko.observableArray<Attribute<any>>();
            this.attributes.push(new Attribute<string>(this.name, 'Name', enums.AttributeTemplates.INPUT));

            this.prioX = ko.observableArray<enums.Dimension>();
            this.prioY = ko.observableArray<enums.Dimension>();

            this.updating = false;

            this.apply = (object: fabric.IObject) => {

                this.object = object;
                this.initSelectdProperties();
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

            this.update = (reapply?: boolean) => {

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
                    //this.object.setData(enums.Dimension[enums.Dimension.Right], this.right.getProperties());
                }
                
                let difBottom = Util.canvas.getHeight() - this.object.getTop() - this.object.getHeight()
                if(this.bottom.value() !== difBottom) {
                    this.bottom.value(difBottom);
                    //this.object.setData(enums.Dimension[enums.Dimension.Bottom], this.bottom.getProperties());
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

                this.getDimension(dimension).isLocked(true);

                if(this.getDimension(Util.getOppositeDimension(dimension)).isLocked()) {
                    if(Util.isHorizontal(dimension))
                        this.width.isLocked(false);
                    else
                        this.height.isLocked(false);
                }

                this.object.data['prioX'] = this.prioX().slice();
                this.object.data['prioY'] = this.prioY().slice();
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

            // this.isLatestPrio = (dimension: Dimension) => {
                
            //     if(Util.isHorizontal(dimension))
            //         return this.prioX()[0] == dimension;
            //     else
            //         return this.prioY()[0] == dimension;
            // }

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

            this.initSelectdProperties = () => {

                this.prioX.push.apply(this.prioX, this.object.data['prioX']);
                this.prioY.push.apply(this.prioY, this.object.data['prioY']);
            }

            this.init = () => {

                this.width.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Width, value); });
                this.height.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Height, value); });
                this.top.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Top, value); });
                this.right.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Right, value); });
                this.bottom.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Bottom, value);});
                this.left.value.subscribe((value) => { this.applyDimensionValue(enums.Dimension.Left, value);});

                // this.width.getProperties.subscribe((data) => { this.applyDimensionProperties(enums.Dimension.Width, data); });
                // this.height.getProperties.subscribe((data) => { this.applyDimensionProperties(enums.Dimension.Height, data); });
                // this.top.getProperties.subscribe((data) => { this.applyDimensionProperties(enums.Dimension.Top, data); });
                // this.right.getProperties.subscribe((data) => { this.applyDimensionProperties(enums.Dimension.Right, data); });
                // this.bottom.getProperties.subscribe((data) => { this.applyDimensionProperties(enums.Dimension.Bottom, data);});
                // this.left.getProperties.subscribe((data) => { this.applyDimensionProperties(enums.Dimension.Left, data);});
            }
            
            this.init();
        }

        public snaptTo(element: EditorObject, edge: enums.Direction) {

            this.updating = true;

            switch(edge) {
                case enums.Direction.TOP: 
                    this.top.getValue().deserialize(Util.addDimensionValues(element.top.getValue(), element.height.getValue()));
                    break;
                case enums.Direction.RIGHT: 
                    this.right.getValue().deserialize(Util.addDimensionValues(element.right.getValue(), element.width.getValue()));
                    break;
                case enums.Direction.BOTTOM: 
                    this.bottom.getValue().deserialize(Util.addDimensionValues(element.bottom.getValue(), element.height.getValue()));
                    break;
                case enums.Direction.LEFT: 
                    this.left.getValue().deserialize(Util.addDimensionValues(element.left.getValue(), element.width.getValue()));
                    break;
            }

            this.update();
            this.updating = false;
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

        private applyWidth(value: number) {
            console.info('-- WIDTH --');
            let oldValue = this.object.getWidth();
            console.log("Width applied: ", oldValue + ' -- > ' + value);
            this.object.setWidth(value);
            this.setPrio(enums.Dimension.Width);

            if(this.getPrio(enums.Dimension.Width) == enums.Dimension.Right) {
                oldValue = this.object.getLeft();
                let newValue = Util.canvas.getWidth() - value - this.right.value();
                console.log("Object docked right, left applied: ", oldValue + ' -- > ' + newValue);
                this.object.setLeft(newValue);
            }
        }

        private applyHeight(value: number) {
            console.info('-- HEIGHT --');
            let oldValue = this.object.getHeight();
            console.log("Height applied: ", oldValue + ' -- > ' + value);
            this.object.setHeight(value);
            this.setPrio(enums.Dimension.Height);

            if(this.getPrio(enums.Dimension.Height) == enums.Dimension.Bottom) {
                oldValue = this.object.getTop();
                let newValue = (Util.canvas.getHeight() - value - this.bottom.value());
                console.log("Object docked bottom, top applied: ", oldValue + ' -- > ' + newValue);
                this.object.setTop(newValue);
            }
        }

        private applyTop(value: number) {
            console.info('-- TOP --');
            let oldValue = this.object.getTop();
            console.log("Top applied: ", oldValue + ' -- > ' + value);
            this.object.setTop(value);
            this.setPrio(enums.Dimension.Top);

            if(this.getPrio(enums.Dimension.Top) == enums.Dimension.Bottom) {
                oldValue = this.object.getHeight();
                let newValue = Util.canvas.getHeight() - value - this.bottom.value();
                console.log("Object docked bottom, height applied: ", oldValue + ' -- > ' + newValue);
                this.object.setHeight(newValue);
            }
        }

        private applyRight(value: number) {
            console.info('-- RIGHT --');
            this.object.data['Right'] || (this.object.data['Right'] = {});
            this.object.data['Right']['value'] = value;
            this.right.value(value);
            this.setPrio(enums.Dimension.Right);
            
            if(this.getPrio(enums.Dimension.Right) == enums.Dimension.Left) {
                let oldValue = this.object.getWidth();
                let newValue = Util.canvas.getWidth() - value - this.left.value();
                console.log("Object docked left, width applied: ", oldValue + ' -- > ' + newValue);
                this.object.setWidth(newValue);
            }
            else {
                let oldValue = this.object.getLeft();
                let newValue = Util.getCanvasWidth() - value - this.object.getWidth();
                console.log("Object width set, left applied: ", oldValue + ' -- > ' + newValue);
                this.left.value(newValue);
                this.object.setLeft(newValue);
            }
        }

        private applyBottom(value: number) {
            console.info('-- BOTTOM --');
            this.object.data['Bottom'] || (this.object.data['Bottom'] = {});
            this.object.data['Bottom']['value'] = value;
            this.bottom.value(value);
            this.setPrio(enums.Dimension.Bottom);
            
            if(this.getPrio(enums.Dimension.Bottom) == enums.Dimension.Top) {
                let oldValue = this.object.getHeight();
                let newValue = Util.canvas.getHeight() - value - this.top.value();
                console.log("Object docked top, height applied: ", oldValue + ' -- > ' + newValue);
                this.object.setHeight(newValue);
            }
            else {
                let oldValue = this.object.getTop();
                let newValue = Util.getCanvasHeight() - value - this.object.getHeight();
                console.log("Object top set, top applied: ", oldValue + ' -- > ' + newValue);
                this.top.value(newValue);
                this.object.setTop(newValue);
            }
        }

        private applyLeft(value: number) {
            console.info('-- LEFT --');
            let oldValue = this.object.getLeft();
            console.log("Left applied: ", oldValue + ' -- > ' + value);
            this.object.setLeft(value);
            this.setPrio(enums.Dimension.Left);

            if(this.getPrio(enums.Dimension.Left) == enums.Dimension.Right) {
                oldValue = this.object.getWidth();
                let newValue = Util.canvas.getWidth() - value - this.right.value();
                console.log("Object docked right, width applied: ", oldValue + ' -- > ' + newValue);
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