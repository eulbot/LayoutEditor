module mapp.ple {

    export class Editor {
        
        private menu: KnockoutObservable<Menu>;
        private canvas: KnockoutObservable<Canvas>;

        constructor() {

            this.menu = ko.observable(new Menu());
            this.canvas = ko.observable(new Canvas(this.menu()));
        }
    }
}