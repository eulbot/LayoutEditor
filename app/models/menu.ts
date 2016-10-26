module mapp.le {
    export class Menu {
        
        private canvas: KnockoutObservable<Canvas>;
        private addFrame: (type: le.enums.ElementType) => void;
        private selectObject: (element: fabric.IObject, event) => void;
        
        // Menu entries
        private toggleMenuItem: (string) => void;
        private toggleStates: KnockoutObservableArray<boolean>;
        private toggleState: KnockoutComputed<number>;
        public displayValue: KnockoutComputed<number>;

        private pageSetup: mapp.le.PageSetup;
        private templateList: mapp.le.TemplateList;
        private selectedPageSize: KnockoutObservable<IPageSize>;
        private defaultPageSizes: IPageSize[];

        private init: () => void;
        
        constructor(canvas: Canvas) {
            
            this.canvas = ko.observable<Canvas>(canvas);

            this.selectedPageSize = ko.observable<IPageSize>();
            this.defaultPageSizes = Util.defaultPageSizes();

            this.pageSetup = new PageSetup();
            this.templateList = new TemplateList();

            this.addFrame = () => {
                
                let options = $.extend({}, mapp.le.DefaultFrameOptions, {fill: Util.getRandomColor()});
                this.canvas().addFrame(options);
            }

            this.selectObject = (element: fabric.IObject, event) => {
                
                if(element)
                    this.canvas().selectObject(element.getId());
            }
            //this.init();
        }
    }
}
