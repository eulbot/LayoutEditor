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
        
        public apply: (object: fabric.IObject) => void;
        public moveStep: (direction: mapp.le.Direction) => void;
        public update: () => void;
        public clear: () => void;
        private applyChanges: (dimension: Dimension, dimensionData: IDimensionData) => void;

        private ws: KnockoutSubscription;
        private hs: KnockoutSubscription;
        private ts: KnockoutSubscription;
        private rs: KnockoutSubscription;
        private bs: KnockoutSubscription;
        private ls: KnockoutSubscription;

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

            this.updating = false;

            this.apply = (object: fabric.IObject) => {

                if(this.object)
                    this.clear();

                this.object = object;

                this.ws = this.width.getData.subscribe((data) => {
                    this.applyChanges(Dimension.Width, data);
                });
                
                this.hs = this.height.getData.subscribe((data) => {
                    this.applyChanges(Dimension.Height, data);
                });
                
                this.ts = this.top.getData.subscribe((data) => {
                    this.applyChanges(Dimension.Top, data);
                });
                
                this.rs = this.right.getData.subscribe((data) => {
                    this.applyChanges(Dimension.Right, data);
                });
                
                this.bs = this.bottom.getData.subscribe((data) => {
                    this.applyChanges(Dimension.Bottom, data);
                });
                
                this.ls = this.left.getData.subscribe((data) => {
                    this.applyChanges(Dimension.Left, data);
                });

                this.update();
            }

            this.applyChanges = (dimension: Dimension, dimensionData: IDimensionData) => {
                
                if(this.object && !this.updating) { 
                    
                    this.object.setData(Dimension[dimension], dimensionData.data);

                    if(!isNaN(dimensionData.value) && dimensionData.value !== this.object.get(Dimension[dimension])) {

                        let value = dimensionData.value;

                        if(dimension == Dimension.Right) {
                            
                            this.object.data['Right'] || (this.object.data['Right'] = {});
                            this.object.data['Right']['value'] = dimensionData.value;
                            
                            if(this.object.isDimensionAbsolute(Dimension.Left)) {
                                value = (Util.canvas.getWidth() - dimensionData.value) - this.object.getLeft();
                                this.width.value(value);
                                this.object.set(Dimension[Dimension.Width].toLowerCase(), value);
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
                            
                            if(this.object.isDimensionAbsolute(Dimension.Top)) {
                                value = (Util.canvas.getHeight() - dimensionData.value) - this.object.getLeft();
                                this.height.value(value);
                                this.object.set(Dimension[Dimension.Height].toLowerCase(), value);
                            }
                            else {
                                value = Util.getCanvasHeight() - dimensionData.value - this.object.getHeight();
                                this.top.value(value);
                                this.object.set(Dimension[Dimension.Top].toLowerCase(), value);
                            }
                        }
                        else
                            this.object.set(Dimension[dimension].toLowerCase(), dimensionData.value);
                        

                        this.object.set('scaleX', 1);
                        this.object.set('scaleY', 1);
                        
                        this.object.setCoords();
                        Util.canvas.renderAll();
                    }
                    
                }
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
                if(this.right.value() !== this.object.getRight()) {
                    this.right.value(Util.canvas.getWidth() - this.object.getLeft() - this.object.getWidth());
                }
                if(this.bottom.value() !== this.object.getBottom()) {
                    this.bottom.value(Util.canvas.getHeight() - this.object.getTop() - this.object.getHeight());
                }
                if(this.left.value() !== this.object.getLeft()) {
                    this.left.value(this.object.getLeft());
                }

                this.width.setData(this.object.data[Dimension[Dimension.Width]]);
                this.height.setData(this.object.data[Dimension[Dimension.Height]]);
                this.top.setData(this.object.data[Dimension[Dimension.Top]]);
                this.right.setData(this.object.data[Dimension[Dimension.Right]]);
                this.bottom.setData(this.object.data[Dimension[Dimension.Bottom]]);
                this.left.setData(this.object.data[Dimension[Dimension.Left]]);

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

            this.clear = () => {

                this.updating = true;
                this.ws.dispose();
                this.hs.dispose();
                this.ls.dispose();
                this.ts.dispose();
                Util.setValue(undefined, this.id, this.name, this.width.value, this.height.value, this.top.value, this.right.value, this.bottom.value, this.left.value);
                Util.setValue(false, this.width.showRelative, this.width.isAbsolute, this.height.showRelative, this.height.isAbsolute, 
                    this.top.showRelative, this.top.isAbsolute, this.right.showRelative, this.right.isAbsolute, 
                    this.bottom.showRelative, this.bottom.isAbsolute, this.left.showRelative, this.left.isAbsolute, );
                this.updating = false;
            }
        }
    }
}