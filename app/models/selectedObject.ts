module mapp.le {

    export class SelectedObject {

        private object: fabric.IObject;
        private id: KnockoutObservable<string>;
        private name: KnockoutObservable<string>;

        private width: DimensionData;
        private height: DimensionData;
        private top: DimensionData; 
        private right: DimensionData; 
        private bottom: DimensionData; 
        private left: DimensionData;
        
        private prioX: KnockoutObservableArray<Dimension>;
        private prioY: KnockoutObservableArray<Dimension>;
        private setPrio: (dimension: Dimension) => void;
        private getPrio: (dimension: Dimension) => Dimension;
        private isHorizontal: (dimension: Dimension) => boolean;

        public apply: (object: fabric.IObject) => void;
        private applyChanges: (dimension: Dimension, dimensionData: IDimensionData) => void;
        public isComuted: (dimension: Dimension) => boolean; 
        public moveStep: (direction: mapp.le.Direction) => void;

        public update: () => void;
        public clear: () => void;
        private init: () => void;
        private initSelectdProperties: () => void;

        private updating: boolean;

        constructor() {            

            this.id = ko.observable<string>();
            this.name = ko.observable<string>();
            this.width = new DimensionData(Util.getCanvasWidth);
            this.height = new DimensionData(Util.getCanvasHeight);
            this.top = new DimensionData(Util.getCanvasHeight);
            this.right = new DimensionData(Util.getCanvasWidth);
            this.bottom = new DimensionData(Util.getCanvasHeight);
            this.left = new DimensionData(Util.getCanvasWidth);

            this.prioX = ko.observableArray<Dimension>();
            this.prioY = ko.observableArray<Dimension>();

            this.updating = false;
            this.apply = (object: fabric.IObject) => {

                if(this.object)
                    this.clear();

                this.object = object;
                this.initSelectdProperties();
                this.update();
            }

            this.applyChanges = (dimension: Dimension, dimensionData: IDimensionData) => {
                
                if(this.object && !this.updating) { 
                    
                    console.info('appliying data to ' + Dimension[dimension])
                    this.object.setData(Dimension[dimension], dimensionData);

                    if(!isNaN(dimensionData.value) && dimensionData.value !== this.object.get(Dimension[dimension].toLowerCase())) {

                        let value = dimensionData.value;

                        if(dimension == Dimension.Width) {
                            
                            this.object.set(Dimension[dimension].toLowerCase(), dimensionData.value);
                            if(this.getPrio(dimension) == Dimension.Right) {
                                this.object.setLeft(Util.canvas.getWidth() - this.width.value() - this.right.value());
                            }
                        }
                        else if(dimension == Dimension.Height) {

                            this.object.set(Dimension[dimension].toLowerCase(), dimensionData.value);
                            if(this.getPrio(dimension) == Dimension.Bottom) {
                                this.object.setTop(Util.canvas.getHeight() - this.height.value() - this.bottom.value());
                            }
                        }
                        else if(dimension == Dimension.Top) {
                            this.object.set(Dimension[dimension].toLowerCase(), dimensionData.value);
                            if(this.getPrio(dimension) == Dimension.Bottom) {
                                this.object.setHeight(Util.canvas.getHeight() - this.top.value() - this.bottom.value());
                            }
                        }
                        else if(dimension == Dimension.Right) {
                            
                            this.object.data['Right'] || (this.object.data['Right'] = {});
                            this.object.data['Right']['value'] = dimensionData.value;
                            
                            if(this.getPrio(dimension) == Dimension.Left) {
                                this.object.setWidth(Util.canvas.getWidth() - dimensionData.value - this.left.value());
                            }
                            else {
                                value = Util.getCanvasWidth() - dimensionData.value - this.object.getWidth();
                                this.left.value(value);
                                this.object.set(Dimension[Dimension.Left].toLowerCase(), value);
                            }
                        }
                        else if(dimension == Dimension.Bottom) {
                            this.object.data['Bottom'] || (this.object.data['Bottom'] = {});
                            this.object.data['Bottom']['value'] = dimensionData.value;
                            
                            if(this.getPrio(dimension) == Dimension.Top) {
                                this.object.setHeight(Util.canvas.getHeight() - dimensionData.value - this.top.value());
                            }
                            else {
                                value = Util.getCanvasHeight() - dimensionData.value - this.object.getHeight();
                                this.top.value(value);
                                this.object.set(Dimension[Dimension.Top].toLowerCase(), value);
                            }
                        }
                        else if(dimension == Dimension.Left) {
                            this.object.set(Dimension[dimension].toLowerCase(), dimensionData.value);
                            if(this.getPrio(dimension) == Dimension.Right) {
                                this.object.setWidth(Util.canvas.getWidth() - this.left.value() - this.right.value());
                            }
                        }

                        this.object.set('scaleX', 1);
                        this.object.set('scaleY', 1);
                        
                        this.setPrio(dimension);
                        this.object.setCoords();
                        Util.canvas.renderAll();
                        this.update();
                    }
                }
            }

            this.update = () => {
                
                this.updating = true;
                let difRight, difBottom;

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

                difRight = Util.canvas.getWidth() - this.object.getLeft() - this.object.getWidth();
                if(this.right.value() !== difRight) {
                    this.right.value(difRight);
                    this.object.setData(Dimension[Dimension.Right], this.right.getData());
                }
                
                difBottom = Util.canvas.getHeight() - this.object.getTop() - this.object.getHeight()
                if(this.bottom.value() !== difBottom) {
                    this.bottom.value(difBottom);
                    this.object.setData(Dimension[Dimension.Bottom], this.bottom.getData());
                }

                this.updating = false;
            }

            this.moveStep = (direction: Direction) => {
                switch(direction) {
                    case Direction.TOP:
                        this.top.value(this.top.value() - 1);
                        break;
                    case Direction.RIGHT:
                        this.left.value(this.left.value() + 1);
                        break;
                    case Direction.BOTTOM:
                        this.top.value(this.top.value() + 1);
                        break;
                    case Direction.LEFT:
                        this.left.value(this.left.value() -1);
                        break;
                }
            }

            this.setPrio = (dimension: Dimension) => {

                if(this.isHorizontal(dimension) && this.prioX()[0] != dimension)
                    this.prioX().unshift(dimension);
                else if(!(this.isHorizontal(dimension)) && this.prioY()[0] != dimension)
                    this.prioY().unshift(dimension);
            }

            this.getPrio = (dimension: Dimension) => {

                if(this.isHorizontal(dimension)) {
                    if(this.prioX()[0] != dimension) return this.prioX()[0];
                    else if(this.prioX()[1] != dimension) return this.prioX()[1];
                }
                else if (!(this.isHorizontal(dimension))) {
                    if(this.prioY()[0] != dimension) return this.prioY()[0];
                    else if(this.prioY()[1] != dimension) return this.prioY()[1];
                }
                
                return 0;

            }

            this.isHorizontal = (dimension: number) => {
                return dimension == 0 || dimension == 3 || dimension == 5;
            }

            this.clear = () => {

                this.updating = true;
                Util.setValue(undefined, this.id, this.name, this.width.value, this.height.value, this.top.value, this.right.value, this.bottom.value, this.left.value);
                Util.setValue(false, this.width.showRelative, this.width.isAbsolute, this.height.showRelative, this.height.isAbsolute, 
                    this.top.showRelative, this.top.isAbsolute, this.right.showRelative, this.right.isAbsolute, 
                    this.bottom.showRelative, this.bottom.isAbsolute, this.left.showRelative, this.left.isAbsolute);
                this.updating = false;
            }

            this.initSelectdProperties = () => {
                
                this.width.setData(this.object.data[Dimension[Dimension.Width]]);
                this.height.setData(this.object.data[Dimension[Dimension.Height]]);
                this.top.setData(this.object.data[Dimension[Dimension.Top]]);
                this.right.setData(this.object.data[Dimension[Dimension.Right]]);
                this.bottom.setData(this.object.data[Dimension[Dimension.Bottom]]);
                this.left.setData(this.object.data[Dimension[Dimension.Left]]);
            }

            this.init = () => {

                this.width.getData.subscribe((data) => { this.applyChanges(Dimension.Width, data); });
                this.height.getData.subscribe((data) => { this.applyChanges(Dimension.Height, data); });
                this.top.getData.subscribe((data) => { this.applyChanges(Dimension.Top, data); });
                this.right.getData.subscribe((data) => { this.applyChanges(Dimension.Right, data); });
                this.bottom.getData.subscribe((data) => { this.applyChanges(Dimension.Bottom, data);});
                this.left.getData.subscribe((data) => { this.applyChanges(Dimension.Left, data);});
                
                this.width.isComputed = ko.pureComputed(() => this.right.isAbsolute() && this.left.isAbsolute());
                this.height.isComputed = ko.pureComputed(() => this.top.isAbsolute() && this.bottom.isAbsolute());
                this.top.isComputed = ko.pureComputed(() => this.height.isAbsolute() && this.bottom.isAbsolute());
                this.right.isComputed = ko.pureComputed(() => this.left.isAbsolute() && this.width.isAbsolute());
                this.bottom.isComputed = ko.pureComputed(() => this.top.isAbsolute() && this.height.isAbsolute());
                this.left.isComputed = ko.pureComputed(() => this.right.isAbsolute() && this.width.isAbsolute());
            }
            
            this.init();
        }
    }
}