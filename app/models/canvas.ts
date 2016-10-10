declare namespace fabric {
    export interface ICanvas {
        getObject: (id: any) => IObject;
        getItemByAttr: (attr: string, value: any) => IObject;
    }

    export interface IObject {
        getId: () => string;
        getName: () => string;
        getRight:() => number;
        setRight:(value: number) => void;
        getBottom:() => number;
        setBottom:(value: number) => void;

        snapTop: (ref: fabric.IObject, threshold: number, inside?: boolean) => boolean;
        snapRight: (ref: fabric.IObject, threshold: number, inside?: boolean) => boolean;
        snapBottom: (ref: fabric.IObject, threshold: number, inside?: boolean) => boolean;
        snapLeft: (ref: fabric.IObject, threshold: number, inside?: boolean) => boolean;
        
        withinX: (ref: fabric.IObject, threshold: number) => boolean;
        withinY: (ref: fabric.IObject, threshold: number) => boolean;
    }
}

module mapp.le {

    export class Canvas {

        private domElement: KnockoutObservable<HTMLCanvasElement>;
        private elements: KnockoutObservableArray<fabric.IObject>;
        private canvas: fabric.ICanvas;
        private init: () => void;

        public selectedObject: SelectedObject;
        public addFrame: (options?: fabric.IRectOptions) => void;
        public selectObject: (id: string) => void;
        
        constructor() {
            let count = 1;
            let elementSubstription: KnockoutSubscription;
            this.domElement = ko.observable<HTMLCanvasElement>();
            this.elements = ko.observableArray<fabric.IObject>();
            this.selectedObject = new SelectedObject();

            this.addFrame = (options?: fabric.IRectOptions) => {

                options = $.extend(mapp.le.DefaultFrameOptions, options);
                let newFrame = new fabric.Rect(options);
                newFrame.data = {id: count, name: 'Frame'};
                
                count++;

                this.canvas.add(newFrame);
            }

            this.selectObject = (id: string) => {

                let element = this.canvas.getObject(id);
                this.canvas.setActiveObject(element);
            };

            // Init canvas when DOM element is rendered 
            elementSubstription = this.domElement.subscribe(() => {
                
                if(this.domElement() && !this.canvas) {
                    elementSubstription.dispose();
                    this.init();
                }
            });

            this.init = () => {
                this.canvas = new fabric.Canvas(this.domElement(), <fabric.ICanvasOptions>{
                    uniScaleTransform: true
                });
                this.elements(this.canvas.getObjects());

                Util.canvas = this.canvas;

                // Event handler
                this.canvas.on({
                    "object:added": () => this.elements.notifySubscribers(),
                    "object:removed": () => this.elements.notifySubscribers(),
                    "object:selected": (e: fabric.IEvent) => this.selectedObject.apply(e.target),
                    "object:moving": (e: fabric.IEvent) => {
                        Util.stayInCanvas(e), 
                        Util.snapToObjects(e),
                        this.selectedObject.update() 
                    },
                    "object:scaling": (e: fabric.IEvent) => this.selectedObject.update(),
                    "selection:cleared": () => this.selectedObject.clear()
                });

                
                // $('body').bind('keydown', (e: JQueryKeyEventObject) => {
                    
                //     if(e.keyCode == 38) 
                //         this.selectedObject.moveStep(Direction.TOP);
                //     if(e.keyCode == 39) 
                //         this.selectedObject.moveStep(Direction.RIGHT);
                //     if(e.keyCode == 40) 
                //         this.selectedObject.moveStep(Direction.BOTTOM);
                //     if(e.keyCode == 37) 
                //         this.selectedObject.moveStep(Direction.LEFT);
                // });
            };
        }
    }
}
