/// <reference path="../EditorObject.ts" />

module mapp.le {

    export class Image extends EditorObject {
    
        public url: KnockoutObservable<string>;

        constructor(editor: Editor) {
            super();
            this.url = ko.observable<string>();

            this.attributes.push(new Attribute<string>(this.url, 'URL', enums.AttributeTemplates.INPUT));
        }
    }

}