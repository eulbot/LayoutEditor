module mapp.le {
    export class Canvas {

        private element: KnockoutObservable<HTMLCanvasElement>;
        private canvas: fabric.ICanvas;

        private elements: KnockoutObservableArray<Element>;
        private addElement: (event: any) => void;
        private init: () => void;
        
        constructor() {

            let elementSubstription: KnockoutSubscription;
            this.element = ko.observable<HTMLCanvasElement>();
            this.elements = ko.observableArray<Element>([]);

            this.addElement = (event: any) => {

            }

            // Init canvas when DOM element is rendered 
            elementSubstription = this.element.subscribe(() => {
                
                if(this.element() && !this.canvas) {
                    elementSubstription.dispose();
                    this.init();
                }
            });

            this.init = () => {
                this.canvas = new fabric.Canvas(this.element());

                let options = $.extend({}, mapp.le.DefaultFrameOptions, <fabric.IRectOptions>{
                    left: 150,
                    top: 200
                });
                
                let rect = new fabric.Rect(options);

                this.canvas.add(rect);
                this.canvas.setActiveObject(rect);
            };
        }
    }
}
