module mapp.le {

    export class TemplateList implements IMenuEntry {
        
        private templates: ITemplate[];
        isToggled: KnockoutObservable<boolean>;
        public css: KnockoutComputed<string>;

        constructor(editor: Editor) {
      
            this.isToggled = ko.observable<boolean>(true);

            this.templates = [
                 <ITemplate>{ displayText: "Image", addElement: () => { editor.addElement(new Image(editor)) }},
                 <ITemplate>{ displayText: "Text Box", addElement: () => { editor.addElement(new TextBox(editor)) }}
            ];

            this.css = ko.pureComputed(() => {
                return this.isToggled() ? 'toggled' : '';
            });
        }
    }
}