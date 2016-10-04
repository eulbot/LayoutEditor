module mapp.le {
    export class Canvas {

        private menu: Menu;
        private elements: KnockoutObservableArray<Element>;
        private addElement: (event: any) => void;
        private init: () => void;
        
        constructor(menu: Menu) {

            this.menu = menu;
            this.elements = ko.observableArray<Element>([]);

            this.addElement = (event: any) => {

            }

            this.init = () => { };
            
            this.init();
        }
    }
}
