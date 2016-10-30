module mapp.le {
    export class Menu {
        
        private editor: Editor;
        private addFrame: (type: le.enums.ElementType) => void;
        private selectObject: (element: fabric.IObject, event) => void;
        
        private pageSetup: PageSetup;
        private templateList: TemplateList;
        private elementList: ElementList;

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
            this.elementList = new ElementList(editor);
            this.editor = editor;

            this.selectObject = (element: fabric.IObject, event) => {
                
            }
        }
    }
}
