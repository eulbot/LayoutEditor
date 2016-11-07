/// <reference path="../EditorObject.ts" />

module mapp.le {

    export class Image extends EditorObject implements ISerializable<IImageData> {
    
        public url: KnockoutObservable<string>;

        constructor() {
            super();
            this.url = ko.observable<string>();

            this.attributes.push(new Attribute<string>(this.url, 'URL', enums.AttributeTemplates.INPUT));
        }

        public serialize(): IImageData {
            return $.extend(super.serialize(), { 
                type: enums.ElementType.IMAGE,
                url: this.url()
            });
        }

        public deserialize(imageData: IImageData) {
            super.deserialize(imageData);
            this.url(imageData.url);
        }
    }

}