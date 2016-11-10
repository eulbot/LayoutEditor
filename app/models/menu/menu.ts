module mapp.le {
    export class Menu {
        
        private editor: Editor;
        private addFrame: (type: le.enums.ElementType) => void;
        
        public pageSetup: PageSetup;
        private templateList: TemplateList;
        private elementList: ElementList;

        public selectElement: (element: EditorObject) => void;
        public removeElement: (element: EditorObject) => void;
        public isSelected: (element: EditorObject) => boolean;

        constructor(editor: Editor) {

            this.pageSetup = new PageSetup(editor);
            this.templateList = new TemplateList(editor);
            this.elementList = new ElementList(editor);
            this.editor = editor;

            this.selectElement = (element: EditorObject) => {
                editor.selectElement(element);
                this.editor.propertiesView.isToggled(true);
            }

            this.removeElement = (element: EditorObject) => {
                editor.removeElement(element);
            }

            this.isSelected = (element: EditorObject) => {
                return element == editor.selectedElement();
            }
        }
    }
}
