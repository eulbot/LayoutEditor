module mapp.ple {
    export class Menu {
        
        private menuElements: KnockoutObservableArray<Element>;
        public GetMenuElement: (id: string) => Element;
        public IsMenuElement: (id: string) => boolean;  

        private Init: () => void;
        
        constructor() {
            
            this.menuElements = ko.observableArray<Element>();
            this.menuElements.push(new Frame());
            this.menuElements.push(new Frame());

            this.GetMenuElement = (id: string) => {
                
                let result: Element = null;

                $.each(this.menuElements(), (i, v: Element) => {
                    if(v.Id == id)
                        result = v;
                })

                return result;
            };

            this.IsMenuElement = (id: string) => {
                
                return this.GetMenuElement(id) !== null;
            };

            this.Init = () => {

                interact('.menu-element > *:last-child').draggable({
                    inertia: false,
                    onmove: Util.moveObject,
                    onend: Util.resetObject
                })
            };
            
            setTimeout(this.Init, 0);
        }
    }
}
