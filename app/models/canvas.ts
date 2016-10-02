module mapp.ple {
    export class Canvas {

        private menu: Menu;
        private elements: KnockoutObservableArray<Element>;
        private addElement: (event: any) => void;
        private init: () => void;
        
        constructor(menu: Menu) {

            this.menu = menu;
            this.elements = ko.observableArray<Element>([]);

            this.addElement = (event: any) => {

                let target: HTMLElement = <HTMLElement>event.relatedTarget;
                let menuItem = this.menu.GetMenuElement(target.getAttribute('id'));

                if(menuItem) {

                    var newElement: Element = menuItem.createInstance();
                    
                    newElement.copyPosition(menuItem);
                    this.elements.push(newElement); 

                    setTimeout(function() {
                        interact('#'.concat(newElement.Id)).draggable({ onmove: Util.moveObject });
                    }, 0);
                }
            }

            this.init = () => {

                interact('.page').dropzone({
                    ondropactivate: function (event: JQueryMouseEventObject) {
                        event.target.classList.add('drop-active');
                    },
                    ondragenter: function (event: JQueryMouseEventObject) {
                        event.target.classList.add('drop-active');
                    },
                    ondragleave: function (event: JQueryMouseEventObject) {
                        event.target.classList.remove('drop-active');
                    },
                    ondrop: this.addElement,
                    ondropdeactivate: function (event: JQueryMouseEventObject) {
                        event.target.classList.remove('drop-active');
                    }
                })
            };

            
            this.init();
        }
    }
}
