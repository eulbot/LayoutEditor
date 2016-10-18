declare namespace fabric {
    export interface ICanvas {
        getObject: (id: any) => IObject;
        getItemByAttr: (attr: string, value: any) => IObject;
    }

    export interface IObject {
        getId: () => string;
        getName: () => string;
        getRight:() => number;
        setRight: (value: number) => void;
        getBottom: () => number;
        setBottom: (value: number) => void;
        isDimensionAbsolute: (dimension: number) => boolean;
        setData: (key: string, value: any) => void;

        snapTop: (ref: fabric.IObject, threshold: number, inside?: boolean) => boolean;
        snapRight: (ref: fabric.IObject, threshold: number, inside?: boolean) => boolean;
        snapBottom: (ref: fabric.IObject, threshold: number, inside?: boolean) => boolean;
        snapLeft: (ref: fabric.IObject, threshold: number, inside?: boolean) => boolean;
        
        withinX: (ref: fabric.IObject, threshold: number, inside?: boolean) => boolean;
        withinY: (ref: fabric.IObject, threshold: number, inside?: boolean) => boolean;
    }
}

module mapp.le {

    export class Canvas {

        private canvasWrapperClass = 'canvas-wrapper';
        private domElement: KnockoutObservable<HTMLCanvasElement>;
        private elements: KnockoutObservableArray<fabric.IObject>;
        private canvas: fabric.ICanvas;
        private init: () => void;

        public selectedObject: SelectedObject;
        public addFrame: (options?: fabric.IRectOptions) => void;
        public selectObject: (arg: string | fabric.IObject) => void;
        public removeObject: (id: string) => void;
        
        constructor() {
            let count = 0;
            let elementSubstription: KnockoutSubscription;
            this.domElement = ko.observable<HTMLCanvasElement>();
            this.elements = ko.observableArray<fabric.IObject>();
            this.selectedObject = new SelectedObject();

            this.addFrame = (options?: fabric.IRectOptions) => {

                count++;
                options = $.extend(mapp.le.DefaultFrameOptions, options);
                let newFrame = new fabric.Rect(options);
                newFrame.data = {id: count.toString(), name: 'Frame', data: {}};
                
                this.canvas.add(newFrame);
                this.canvas.setActiveObject(newFrame);
            }

            this.selectObject = (id: string) => {

                let element = this.canvas.getObject(id);
                this.canvas.setActiveObject(element);
            };

            this.removeObject = (arg: string | fabric.IObject) => {

                if(typeof arg == 'string')
                    this.canvas.remove(this.canvas.getObject(arg));
                else
                    this.canvas.remove(arg)
            };

            // Init canvas when DOM element is rendered 
            elementSubstription = this.domElement.subscribe(() => {
                
                if(this.domElement() && !this.canvas) {
                    elementSubstription.dispose();
                    this.init();
                }
            });

            this.init = () => {

                let resizing = false;

                this.canvas = new fabric.Canvas(this.domElement(), <fabric.ICanvasOptions>{
                    uniScaleTransform: true,
                    containerClass: this.canvasWrapperClass
                });
                this.elements(this.canvas.getObjects());

                Util.canvas = this.canvas;

                // Event handler
                this.canvas.on({
                    "object:added": () => this.elements.notifySubscribers(),
                    "object:removed": () => this.elements.notifySubscribers(),
                    "object:selected": (e: fabric.IEvent) => this.selectedObject.apply(e.target),
                    "object:moving": (e: fabric.IEvent) => {

                        Util.stayInCanvasWhileMoving(this.selectedObject);
                        Util.snapToObjectsWhenMoving(this.selectedObject);
                        this.selectedObject.update(); 
                    },
                    "object:scaling": (e: fabric.IEvent) => {

                        let corner: string = e.target['__corner'] || '';
                        Util.stayInCanvasWhileResizing(this.selectedObject, corner);
                        Util.snapToObjectsWhenResizing(this.selectedObject, corner);
                        this.selectedObject.update(true);
                    },
                    "selection:cleared": () => this.selectedObject.clear()
                });
                
                let wrapper = <HTMLElement>this.domElement().parentElement;
                wrapper.tabIndex = 1000;
                $(wrapper).keydown((e: JQueryKeyEventObject) => {
                    
                    if(e.ctrlKey) {

                        console.info('ctrl');

                        if(e.which == 38)
                            Util.moveStep(this.selectedObject, Direction.TOP, 20);
                        if(e.which == 39) 
                            Util.moveStep(this.selectedObject, Direction.RIGHT, 20);
                        if(e.which == 40) 
                            Util.moveStep(this.selectedObject, Direction.BOTTOM, 20);
                        if(e.which == 37) 
                            Util.moveStep(this.selectedObject, Direction.LEFT, 20);
                    }
                    else {

                        if(e.keyCode == 38) 
                            Util.moveStep(this.selectedObject, Direction.TOP);
                        if(e.keyCode == 39) 
                            Util.moveStep(this.selectedObject, Direction.RIGHT);
                        if(e.keyCode == 40) 
                            Util.moveStep(this.selectedObject, Direction.BOTTOM);
                        if(e.keyCode == 37) 
                            Util.moveStep(this.selectedObject, Direction.LEFT);
                        if(e.keyCode == 46)
                            this.removeObject(this.selectedObject.id());
                    }
                });
            };
        }
    }
}
