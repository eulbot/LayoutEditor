module mapp.le {

    export class SelectedObject {

        private object: fabric.IObject;
        private id: KnockoutObservable<string>;
        private name: KnockoutObservable<string>;

        private width: KnockoutObservable<number>;
        private height: KnockoutObservable<number>;
        private left: KnockoutObservable<number>;
        private top: KnockoutObservable<number>; 
        
        private widthDisplayRel: KnockoutObservable<boolean>;

        private widthAbs: KnockoutObservable<boolean>;
        private heightAbs: KnockoutObservable<boolean>;
        private leftAbs: KnockoutObservable<boolean>;
        private topAbs: KnockoutObservable<boolean>; 

        // private scaleX: KnockoutObservable<number>;
        // private scaleY: KnockoutObservable<number>; 

        public apply: (object: fabric.IObject) => void;
        public moveStep: (direction: mapp.le.Direction) => void;
        public update: () => void;
        public clear: () => void;
        private applyProperty: (value: any, property: string) => void;

        private ws: KnockoutSubscription;
        private hs: KnockoutSubscription;
        private ls: KnockoutSubscription;
        private ts: KnockoutSubscription;

        constructor(object?: fabric.IObject) {
            
            this.id = ko.observable<string>();
            this.name = ko.observable<string>();
            this.width = ko.observable<number>();
            this.height = ko.observable<number>();
            this.left = ko.observable<number>();
            this.top = ko.observable<number>();

            this.widthDisplayRel = ko.observable<boolean>(false);

            this.widthAbs = ko.observable<boolean>(false);
            this.heightAbs = ko.observable<boolean>(false);
            this.leftAbs = ko.observable<boolean>(false);
            this.topAbs = ko.observable<boolean>(false);

            // this.scaleX = ko.observable<number>();
            // this.scaleY = ko.observable<number>();

            this.apply = (object: fabric.IObject) => {

                this.object = object;
                this.update();

                if(this.ws) this.ws.dispose();
                if(this.hs) this.hs.dispose();
                if(this.ls) this.ls.dispose();
                if(this.ts) this.ts.dispose();

                this.ws = this.width.subscribe((v: number) => {
                    this.applyProperty(v, 'width');
                })

                this.hs = this.height.subscribe((v: number) => {
                    this.applyProperty(v, 'height');
                })
                
                this.ls = this.left.subscribe((v: number) => {
                    this.applyProperty(v, 'left');
                })
                
                this.ts = this.top.subscribe((v: number) => {
                    this.applyProperty(v, 'top');
                })
                
                this.applyProperty = (value: any, property: string) => {

                    let parsed = parseInt(value);

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
                
                if(this.width() !== this.object.getWidth()) {
                    this.width(Math.round(this.object.getWidth()));
                }
                if(this.height() !== this.object.getHeight()) {
                    this.height(Math.round(this.object.getHeight()));
                }
                if(this.left() !== this.object.getLeft()) {
                    this.left(Math.round(this.object.getLeft()));
                }
                if(this.top() !== this.object.getTop()) {
                    this.top(Math.round(this.object.getTop()));
                }
                // if(this.scaleX() !== this.object.scaleX) {
                //     this.scaleX(this.object.scaleX);
                // }
                // if(this.scaleY() !== this.object.scaleY) {
                //     this.scaleY(this.object.scaleY);
                // }
            }

            this.moveStep = (direction: Direction) => {
                switch(direction) {
                    case Direction.TOP:
                        this.top(this.top() - 1);
                        break;
                    case Direction.RIGHT:
                        this.left(this.left() + 1);
                        break;
                    case Direction.BOTTOM:
                        this.top(this.top() + 1);
                        break;
                    case Direction.LEFT:
                        this.left(this.left() -1);
                        break;
                }
            }

            this.clear = () => {

                Util.setValue(null, this.id, this.name, this.width, this.height, this.left, this.top);
            }

            if(object)
                this.update();
        }
    }
}