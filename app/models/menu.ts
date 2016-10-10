module mapp.le {
    export class Menu {
        
        private canvas: KnockoutObservable<Canvas>;
        private addFrame: (type: ElementType) => void;
        private selectObject: (element: fabric.IObject, event) => void;
        private init: () => void;
        
        constructor(canvas: Canvas) {
            
            this.canvas = ko.observable<Canvas>(canvas);

            this.addFrame = () => {
                
                let options = $.extend({}, mapp.le.DefaultFrameOptions, {fill: Util.getRandomColor()});
                this.canvas().addFrame(options);
            }

            this.selectObject = (element: fabric.IObject, event) => {
                
                if(element)
                    this.canvas().selectObject(element.getId());
            }

            this.init = () => {
                

            };
            
            this.init();
        }
    }
}
