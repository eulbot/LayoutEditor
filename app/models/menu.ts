module mapp.le {
    export class Menu {
        
        private canvas: KnockoutObservable<Canvas>;
        private addFrame: (type: le.enums.ElementType) => void;
        private selectObject: (element: fabric.IObject, event) => void;
        
        private pageSetup: mapp.le.PageSetup;
        private templateList: mapp.le.TemplateList;

        // Menu entries
        private toggleMenuItem: (string) => void;
        private toggleStates: KnockoutObservableArray<boolean>;
        private toggleState: KnockoutComputed<number>;
        public displayValue: KnockoutComputed<number>;

        private init: () => void;
        
        constructor(editor: Editor) {
            
            //this.canvas = ko.observable<Canvas>(canvas);

            this.pageSetup = new PageSetup();
            this.templateList = new TemplateList(editor);

            this.addFrame = () => {
                
                let options = $.extend({}, mapp.le.DefaultFrameOptions, {fill: Util.getRandomColor()});
                //this.canvas().addFrame(options);
            }

            this.selectObject = (element: fabric.IObject, event) => {
                
                //if(element)
                    //this.canvas().selectObject(element.getId());
            }
            //this.init();
        }
    }
}
