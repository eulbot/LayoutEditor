module mapp.le {

    export class Editor {
        
        private menu: KnockoutObservable<Menu>;
        private canvas: KnockoutObservable<Canvas>;

        constructor() {

            this.canvas = ko.observable(new Canvas());
            this.menu = ko.observable(new Menu(this.canvas()));
        }
    }
}