/// <reference path="../EditorObject.ts" />

module mapp.le {

    export class Image extends EditorObject {
    
        public url: KnockoutObservable<string>;

        constructor(editor: Editor) {
            super();
            this.name('Image' + this.name());
            this.url = ko.observable<string>();
        }
    }

}