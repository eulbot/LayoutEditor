module mapp.le {

    export class Editor {
        
        public menu: Menu;
        public canvas: Canvas;

        public elements: KnockoutObservableArray<SelectedObject>;
        public selectedElement: SelectedObject;
        
        public addElement: (element: SelectedObject) => void;
        public selectElement: (element: SelectedObject) => void;

        constructor() {

            this.elements = ko.observableArray<SelectedObject>([]);
            this.canvas = new Canvas(this);
            this.menu = new Menu(this);

            this.addElement = (element: SelectedObject) => {
                this.elements.push(element);
                this.selectElement(element);
            };

            this.selectElement = (element: SelectedObject) => {
                this.selectedElement = element; 
            }
        }
    }
}