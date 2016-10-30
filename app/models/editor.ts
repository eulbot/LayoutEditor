module mapp.le {

    export class Editor {
        
        public menu: Menu;
        public propertiesView: PropertiesView;
        public canvas: Canvas;

        public elements: KnockoutObservableArray<EditorObject>;
        public selectedElement: KnockoutObservable<EditorObject>;
        
        public addElement: (element: EditorObject) => void;
        public selectElement: (element: EditorObject) => void;
        public selectElementById: (id: string) => void;
        public clearSelection: () => void;

        constructor() {

            this.selectedElement = ko.observable<EditorObject>(new EditorObject());
            this.elements = ko.observableArray<EditorObject>([]);

            this.menu = new Menu(this);
            this.propertiesView = new PropertiesView(this);
            this.canvas = new Canvas(this);

            this.addElement = (element: EditorObject) => {
                this.elements.push(element);
                this.selectElement(element);
                this.selectedElement().apply(this.canvas.addFrame(DefaultFrameOptions));
                this.propertiesView.isToggled(true);
            };

            this.selectElement = (element: EditorObject) => {
                this.selectedElement(element); 
            };

            this.selectElementById = (id: string) => {
                $.each(this.elements(), (i: number, element: EditorObject) => {
                    if(element.object && element.object.getId() == id)
                        this.selectElement(element);
                });
            };

            this.clearSelection = () => {
                this.selectedElement(new EditorObject());
            };
        }
    }
}