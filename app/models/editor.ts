module mapp.le {

    export class Editor {
        
        public menu: Menu;
        public canvas: Canvas;

        public elements: SelectedObject[];
        public selectedElement: SelectedObject;
        
        public addElement: (element: SelectedObject) => void;
        public selectElement: (element: SelectedObject) => void;

        constructor() {

            this.elements = [];
            this.canvas = new Canvas(this);
            this.menu = new Menu(this);

            this.addElement = (element: SelectedObject) => {
                
                this.selectedElement = element;
            };
        }
    }
}