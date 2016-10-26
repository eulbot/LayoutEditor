module mapp.le {

    export class TextBox extends SelectedObject implements ITemplate {
    
        public content: KnockoutObservable<string>;
        public displayText: string;

        constructor() {
            super();
            this.content = ko.observable<string>();
            this.displayText = "Text Box";
        }
    }

}