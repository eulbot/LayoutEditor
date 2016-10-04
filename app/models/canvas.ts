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

                let target: HTMLElement = <HTMLElement>event.target;
                let relatedTarget: HTMLElement = <HTMLElement>event.relatedTarget;
                let menuItem = this.menu.GetMenuElement(relatedTarget.getAttribute('id'));

                if(menuItem) {

                    var newElement: Element = menuItem.createInstance();
                    newElement.setPosition(Util.getOffset(relatedTarget, target, Offset.LEFT), Util.getOffset(relatedTarget, target, Offset.TOP));

                    this.elements.push(newElement); 

                    setTimeout(function() {
                        interact('#'.concat(newElement.Id)).draggable({ 
                            inertia: true,
                            restrict: {
                                restriction: "parent",
                                endOnly: true,
                                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                            },
                            onmove: Util.moveObject
                         })
                        .resizable({
                            preserveAspectRatio: false,
                            edges: { left: true, right: true, bottom: true, top: true }
                        })
                        .on('resizemove', Util.resizeObject);
                    }, 0);
                }
            }

            this.init = () => {

                interact('.page').dropzone({
                    ondropactivate: function (event: JQueryMouseEventObject) {
                        if(menu.IsMenuElement((<HTMLElement>event.relatedTarget).getAttribute('id')))
                            event.target.classList.add('drop-active');
                    },
                    ondragenter: function (event: JQueryMouseEventObject) {
                        if(menu.IsMenuElement((<HTMLElement>event.relatedTarget).getAttribute('id')))
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
