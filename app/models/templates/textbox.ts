module mapp.le {

    export class TextBox extends SelectedObject {
    
        public content: KnockoutObservable<string>;

        constructor() {
            super();
            this.content = ko.observable<string>();
        }
    }

}