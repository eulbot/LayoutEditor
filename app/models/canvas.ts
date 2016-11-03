declare namespace fabric {
    export interface ICanvas {
        getObject: (id: number) => IObject;
        getItemByAttr: (attr: string, value: any) => IObject;
    }

    export interface IObject {
        getId: () => number;
        getName: () => string;
        getRight:() => number;
        setRight: (value: number) => void;
        getBottom: () => number;
        setBottom: (value: number) => void;
        isDimensionLocked: (dimension: number) => boolean;
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

        public addFrame: (options?: fabric.IRectOptions, cloneFrom?: fabric.IObject) => fabric.IObject;
        public selectObject: (arg: number | fabric.IObject) => void;
        public removeObject: (arg: number | fabric.IObject) => void;
        
        constructor(editor: Editor) {
            let count = 0;
            let elementSubstription: KnockoutSubscription;
            this.domElement = ko.observable<HTMLCanvasElement>();
            this.elements = ko.observableArray<fabric.IObject>();

            this.addFrame = (options: fabric.IRectOptions, cloneFrom?: fabric.IObject) => {

                count++;
                options = $.extend(mapp.le.DefaultFrameOptions, options, {fill:'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',0.75)'});
                let newFrame = new fabric.Rect(options);
                newFrame.data = {//id: count.toString(), name: 'Frame', 
                    Width: {
                        isLocked: true
                    },
                    Height: {
                        isLocked: true
                    }
                };
                
                if(cloneFrom) {
                    newFrame.setLeft(cloneFrom.getLeft());
                    newFrame.setTop(cloneFrom.getTop());
                    newFrame.setWidth(cloneFrom.getWidth());
                    newFrame.setHeight(cloneFrom.getHeight());
                    newFrame.setCoords();
                }
                
                this.canvas.add(newFrame);
                
                return newFrame;
            }

            this.selectObject = (arg: number | fabric.IObject) => {

                let element: fabric.IObject;

                if(typeof arg == 'number')
                    element = this.canvas.getObject(arg);
                else
                    element = arg;

                if(this.canvas.getActiveObject() != element)
                    this.canvas.setActiveObject(element);
            };

            this.removeObject = (arg: number | fabric.IObject) => {

                if(typeof arg == 'number')
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
                let ctrlPressed = false;
                let target: fabric.IObject;

                this.canvas = new fabric.Canvas(this.domElement(), <fabric.ICanvasOptions>{
                    uniScaleTransform: true,
                    containerClass: this.canvasWrapperClass,
                    selection: false
                });
                this.elements(this.canvas.getObjects());

                Util.canvas = this.canvas;

                // Event handler
                this.canvas.on({
                    "object:added": () => this.elements.notifySubscribers(),
                    "object:removed": () => this.elements.notifySubscribers(),
                    "object:selected": (e: fabric.IEvent) => {
                            editor.selectElement(e.target); 
                    },
                    "object:moving": (e: fabric.IEvent) => {
                        
                        Util.observeMoving(editor.selectedElement());
                        editor.selectedElement().update(); 
                    },
                    "object:scaling": (e: fabric.IEvent) => {

                        resizing = true;
                        let corner: string = e.target['__corner'] || '';
                        Util.observeResizing(editor.selectedElement(), corner);
                        editor.selectedElement().update(true);
                    },
                    "selection:cleared": () => editor.clearSelection(),
                    "mouse:move": (e: fabric.IEvent) => {
                        
                        target = e.target;

                        if(target && ctrlPressed) {
                            target.hoverCursor = 'copy';
                        }   
                        else if (target && !ctrlPressed) {
                            target.hoverCursor = 'move';
                        }
                    },
                    "mouse:down": (e: fabric.IEvent) => {
                        if(ctrlPressed && e.target) {
                            ctrlPressed = false;
                            
                            let options = $.extend({}, mapp.le.DefaultFrameOptions, {});
                            let clone = this.addFrame(options, e.target);
                            this.canvas.bringToFront(clone);

                            editor.addClonedObject(e.target, clone);
                            
                            // Not good but there is no public method to override the current tansform object
                            (<any>(this.canvas))._setupCurrentTransform(e.e, clone);
                        }
                    },
                    "mouse:up": () => {
                        if(resizing) 
                            editor.selectedElement().reapply();
                           
                        resizing = false;
                        
                    }
                });
                
                let wrapper = <HTMLElement>this.domElement().parentElement;
                wrapper.tabIndex = 1000;
                $(wrapper).keydown((e: JQueryKeyEventObject) => {
                    
                    if(e.ctrlKey) {

                        ctrlPressed = true;

                        if(e.which == 38)
                            Util.moveStep(editor.selectedElement(), enums.Direction.TOP, 20);
                        if(e.which == 39) 
                            Util.moveStep(editor.selectedElement(), enums.Direction.RIGHT, 20);
                        if(e.which == 40) 
                            Util.moveStep(editor.selectedElement(), enums.Direction.BOTTOM, 20);
                        if(e.which == 37) 
                            Util.moveStep(editor.selectedElement(), enums.Direction.LEFT, 20);
                    }
                    else {

                        if(e.keyCode == 38) 
                            Util.moveStep(editor.selectedElement(), enums.Direction.TOP);
                        if(e.keyCode == 39) 
                            Util.moveStep(editor.selectedElement(), enums.Direction.RIGHT);
                        if(e.keyCode == 40) 
                            Util.moveStep(editor.selectedElement(), enums.Direction.BOTTOM);
                        if(e.keyCode == 37) 
                            Util.moveStep(editor.selectedElement(), enums.Direction.LEFT);
                        if(e.keyCode == 46)
                            this.removeObject(editor.selectedElement().object);
                    }
                });

                
                $(wrapper).keyup((e: JQueryKeyEventObject) => {

                    if(!e.ctrlKey)
                        ctrlPressed = false;
                });
            };
        }
    }
}
