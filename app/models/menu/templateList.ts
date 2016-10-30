module mapp.le {

    export class TemplateList extends AMenuEntry {
        
        private templates: ITemplate[];
        constructor(editor: Editor) {
        
            super();
            this.isToggled = ko.observable<boolean>(true);

            this.templates = [
                 <ITemplate>{ displayText: "Image", addElement: () => { editor.addElement(new Image(editor)) }},
                 <ITemplate>{ displayText: "Text Box", addElement: () => { editor.addElement(new TextBox(editor)) }}
            ];
        }
    }
}