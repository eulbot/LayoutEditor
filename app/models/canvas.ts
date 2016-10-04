declare namespace fabric {
    export interface ICanvas {
        getObject: (id: any) => IObject;
        getItemByAttr: (attr: string, value: any) => IObject;
    }
}

module mapp.le {
    export class Canvas {

        private element: KnockoutObservable<HTMLCanvasElement>;
        private elements: KnockoutObservableArray<fabric.IObject>;
        private canvas: fabric.ICanvas;

        public addFrame: (options?: fabric.IRectOptions) => void;
        public selectObject: (id: string) => void;
        private init: () => void;
        
        constructor() {
            let count = 1;
            let elementSubstription: KnockoutSubscription;
            this.element = ko.observable<HTMLCanvasElement>();
            this.elements = ko.observableArray<fabric.IObject>();

            this.addFrame = (options?: fabric.IRectOptions) => {

                let newFrame = new fabric.Rect(mapp.le.DefaultFrameOptions);
                newFrame.data = {id: count, name: 'Frame'};
                count++;

                this.canvas.add(newFrame);
            }

            this.selectObject = (id: string) => {
                this.canvas.setActiveObject(this.canvas.getObject(id));
            };

            // Init canvas when DOM element is rendered 
            elementSubstription = this.element.subscribe(() => {
                
                if(this.element() && !this.canvas) {
                    elementSubstription.dispose();
                    this.init();
                }
            });

            this.init = () => {
                this.canvas = new fabric.Canvas(this.element());
                this.elements(this.canvas.getObjects());
                this.canvas.on({
                    "object:added": () => this.elements.notifySubscribers(),
                    "object:removed": () => this.elements.notifySubscribers()
                });
            };
        }
    }
}
