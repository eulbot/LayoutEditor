module mapp.le {

    export class SelectedObject {

        private object: fabric.IObject;
        private id: KnockoutObservable<string>;
        private name: KnockoutObservable<string>;

        private width: Dimension;
        private height: Dimension;
        private left: Dimension;
        private top: Dimension; 
        
        public apply: (object: fabric.IObject) => void;
        public moveStep: (direction: mapp.le.Direction) => void;
        public update: () => void;
        public clear: () => void;
        private applyProperty: (value: any, property: string) => void;
        private applyWidthChanges: (dimension: Dimension, property: string) => void;
        private applyChanges: (dimension: Dimension, property: string) => void;

        private ws: KnockoutSubscription;
        private wsi: KnockoutSubscription;
        private hs: KnockoutSubscription;
        private hsi: KnockoutSubscription;
        private ls: KnockoutSubscription;
        private lsi: KnockoutSubscription;
        private ts: KnockoutSubscription;
        private tsi: KnockoutSubscription;

        constructor() {
            
            this.id = ko.observable<string>();
            this.name = ko.observable<string>();
            this.width = new Dimension(Util.getCanvasWidth);
            this.height = new Dimension(Util.getCanvasHeight);
            this.left = new Dimension(Util.getCanvasWidth);
            this.top = new Dimension(Util.getCanvasHeight);


            this.apply = (object: fabric.IObject) => {

                this.object = object;

                this.ws = this.width.value.subscribe(() => {
                    this.applyChanges(this.width, 'width');
                });
                
                this.hs = this.height.value.subscribe(() => {
                    this.applyChanges(this.height, 'height');
                })
                
                this.ls = this.left.value.subscribe(() => {
                    this.applyChanges(this.left, 'left');
                })
                
                this.ts = this.top.value.subscribe(() => {
                    this.applyChanges(this.top, 'top');
                })
                
                this.wsi = this.width.getData.subscribe(() => {
                    this.object.setData('width', this.width.getData());
                });
                
                this.hsi = this.height.getData.subscribe(() => {
                    this.object.setData('height', this.height.getData());
                });
                
                this.lsi = this.left.getData.subscribe(() => {
                    this.object.setData('left', this.left.getData());
                });
                
                this.tsi = this.top.getData.subscribe(() => {
                    this.object.setData('top', this.top.getData());
                });

                this.update();
            }
                
            this.applyChanges = (dimension: Dimension, dimensionName: string) => {
                
                if(this.object) { 
                    if(!isNaN(dimension.value()) && dimension.value() !== this.object.get(dimensionName)) {
                        this.object.set(dimensionName, dimension.value());
                        
                        if(dimensionName == 'width')
                            this.object.set('scaleX', 1);
                            
                        if(dimensionName == 'height')
                            this.object.set('scaleY', 1);

                        this.object.setCoords();
                        Util.canvas.renderAll();
                        Util.canvas.setActiveObject(this.object);
                    }
                }
            }

            this.update = () => {
                
                if(this.width.value() !== this.object.getWidth()) {
                    this.width.value(this.object.getWidth());
                }
                
                if(this.height.value() !== this.object.getHeight()) {
                    this.height.value(this.object.getHeight());
                }
                if(this.left.value() !== this.object.getLeft()) {
                    this.left.value(this.object.getLeft());
                }
                if(this.top.value() !== this.object.getTop()) {
                    this.top.value(this.object.getTop());
                }

                this.width.setData(this.object.data['width']);
                this.height.setData(this.object.data['height']);
                this.left.setData(this.object.data['left']);
                this.top.setData(this.object.data['top']);
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

                this.ws.dispose();
                this.wsi.dispose();
                this.hs.dispose();
                this.hsi.dispose();
                this.ls.dispose();
                this.lsi.dispose();
                this.ts.dispose();
                this.tsi.dispose();
                Util.setValue(undefined, this.id, this.name, this.width.value, this.height.value, this.left.value, this.top.value);
                Util.setValue(undefined, this.width.showRelative, this.width.isAbsolute, this.height.showRelative, this.height.isAbsolute, 
                    this.left.showRelative, this.left.showRelative, this.top.showRelative, this.top.showRelative)
            }
        }
    }
}