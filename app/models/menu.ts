module mapp.le {
    export class Menu {
        
        private menuElements: KnockoutObservableArray<Element>;
        public GetMenuElement: (id: string) => Element;
        public IsMenuElement: (id: string) => boolean;  

        private Init: () => void;
        
        constructor() {
            
            this.menuElements = ko.observableArray<Element>();
            this.menuElements.push(new Frame());
            this.menuElements.push(new Frame());

            this.Init = () => {
            };
            
            setTimeout(this.Init, 0);
        }
    }
}
