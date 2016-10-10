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

        private ws: KnockoutSubscription;
        private hs: KnockoutSubscription;
        private ls: KnockoutSubscription;
        private ts: KnockoutSubscription;

        constructor() {
            
            this.id = ko.observable<string>();
            this.name = ko.observable<string>();
            this.width = new Dimension(Util.getCanvasWidth);
            this.height = new Dimension(Util.getCanvasHeight);
            this.left = new Dimension(Util.getCanvasWidth);
            this.top = new Dimension(Util.getCanvasHeight);

            this.apply = (object: fabric.IObject) => {

                this.object = object;
                this.update();

                try {
                    this.ws.dispose();
                    this.hs.dispose();
                    this.ls.dispose();
                    this.ts.dispose();
                }
                catch(e){;}

                this.ws = this.width.value.subscribe((v: number) => {
                    this.applyProperty(v, 'width');
                })

                this.hs = this.height.value.subscribe((v: number) => {
                    this.applyProperty(v, 'height');
                })
                
                this.ls = this.left.value.subscribe((v: number) => {
                    this.applyProperty(v, 'left');
                })
                
                this.ts = this.top.value.subscribe((v: number) => {
                    this.applyProperty(v, 'top');
                })
                
                this.applyProperty = (value: any, property: string) => {

                    let parsed = parseFloat(value);

                    if(this.object && !isNaN(parsed) && value !== this.object.get(property)) {
                        this.object.set(property, parsed);
                        
                        if(property == 'width')
                            this.object.set('scaleX', 1);
                            
                        if(property == 'height')
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

                Util.setValue(undefined, this.id, this.name, this.width.value, this.height.value, this.left.value, this.top.value);
            }

            if(this.object)
                this.update();
        }
    }
}