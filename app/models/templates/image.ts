module mapp.le {

    export class Image extends SelectedObject {
    
        public url: KnockoutObservable<string>;

        constructor() {
            super();
            this.url = ko.observable<string>();
        }
    }

}