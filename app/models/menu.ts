module mapp.le {
    export class Menu {
        
        private canvas: KnockoutObservable<Canvas>;
        private addFrame: (type: le.enums.ElementType) => void;
        private selectObject: (element: fabric.IObject, event) => void;
        private pageSizes: PageSize[];
        private selectedPageSize: KnockoutObservable<PageSize>;
        private setPageSize: (pageSize: PageSize) => void;
        private init: () => void;
        
        constructor(canvas: Canvas) {
            
            this.canvas = ko.observable<Canvas>(canvas);
            this.selectedPageSize = ko.observable<PageSize>();

            this.addFrame = () => {
                
                let options = $.extend({}, mapp.le.DefaultFrameOptions, {fill: Util.getRandomColor()});
                this.canvas().addFrame(options);
            }

            this.selectObject = (element: fabric.IObject, event) => {
                
                if(element)
                    this.canvas().selectObject(element.getId());
            }

            this.setPageSize = () => {
                let dpi = 72;
                let inch = 25.4;

                let x = Math.round(this.selectedPageSize().width / inch * dpi);
                let y = Math.round(this.selectedPageSize().height / inch * dpi);

                Util.resizeCanvas(x, y);
            }

            this.init = () => {

                let p1 = new PageSize('A4', 210, 297);
                let p2 = new PageSize('A4 Landscape', 297, 210);

                this.pageSizes = [];
                this.pageSizes.push(p1);
                this.pageSizes.push(p2);

                this.selectedPageSize(p1);
            };
            
            this.init();
        }
    }
}
