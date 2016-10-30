module mapp.le {

    export class TextBox extends EditorObject {
    
        public content: KnockoutObservable<string>;

        constructor(editor: Editor) {
            super();
            this.content = ko.observable<string>();
        }
    }

}