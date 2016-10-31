/// <reference path="../EditorObject.ts" />

module mapp.le {

    export class TextBox extends EditorObject {
    
        public content: KnockoutObservable<string>;

        constructor(editor: Editor) {
            super();
            this.name('TextBox' + this.name());
            this.content = ko.observable<string>();
        }
    }

}