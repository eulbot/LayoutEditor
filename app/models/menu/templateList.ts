module mapp.le {

    export class TemplateList extends AMenuEntry {
        
        private templates: ITemplate[];
        constructor(editor: Editor) {
        
            super();
            this.isToggled = ko.observable<boolean>(true);

            this.templates = [
                 <ITemplate>{ displayText: "Image", icon: "mapp-layout-editor-i-image", addElement: () => { editor.addElement(new Image(editor)) }},
                 <ITemplate>{ displayText: "Text Box", icon: "mapp-layout-editor-i-character", addElement: () => { editor.addElement(new TextBox(editor)) }},
                 <ITemplate>{ displayText: "Map Section", icon: "mapp-layout-editor-i-overview", addElement: () => { editor.addElement(new TextBox(editor)) }}
            ];
        }
    }
}