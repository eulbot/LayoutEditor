/// <reference path="../EditorObject.ts" />

module mapp.le {

    export class TextBox extends EditorObject {
    
        public content: KnockoutObservable<string>;

        constructor() {
            super();
            this.content = ko.observable<string>();
        }
    }

}