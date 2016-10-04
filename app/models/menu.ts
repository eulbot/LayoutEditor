module mapp.le {
    export class Menu {
        
        private canvas: KnockoutObservable<Canvas>;
        private addFrame: (type: ElementType) => void;
        private selectObject: (data, event) => void;
        private init: () => void;
        

        constructor(canvas: Canvas) {
            
            this.canvas = ko.observable<Canvas>(canvas);

            this.addFrame = () => {
                this.canvas().addFrame(mapp.le.DefaultFrameOptions);
            }

            this.selectObject = (data, event) => {
                
                this.canvas().selectObject(data['data']['id']);
            }

            this.init = () => {
            };
            
            this.init();
        }
    }
}
