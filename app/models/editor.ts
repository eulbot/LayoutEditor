module mapp.le {

    export class Editor {
        
        public menu: Menu;
        public propertiesView: PropertiesView;
        public canvas: Canvas;

        public elements: KnockoutObservableArray<EditorObject>;
        public selectedElement: KnockoutObservable<EditorObject>;

        constructor() {

            this.selectedElement = ko.observable<EditorObject>(new EditorObject());
            this.elements = ko.observableArray<EditorObject>([]);

            this.menu = new Menu(this);
            this.propertiesView = new PropertiesView(this);
            this.canvas = new Canvas(this);
            
        }

        public addElement = (element: EditorObject) => {
            let x = this.getNextId(Util.getClassName(element));
            element.id(x);
            this.elements.push(element);

            element.apply(this.canvas.addFrame(DefaultFrameOptions));
            this.selectedElement(element);
            this.propertiesView.isToggled(true);
        };

        public selectElement = (element: EditorObject) => {
            this.selectedElement(element); 
            this.canvas.selectObject(this.selectedElement().object);
        };

        public selectElementById = (id: string) => {
            $.each(this.elements(), (i: number, element: EditorObject) => {
                if(element.object && element.object.getId() == id)
                    this.selectElement(element);
            });
        };

        public removeElement = (element: EditorObject) => {
            this.canvas.removeObject(element.object.getId());
            this.elements.remove(element);
            this.clearSelection();
        }

        public clearSelection = () => {
            this.selectedElement(new EditorObject());
        };

        private getNextId = (prefix: string): string => {
            let result = 1;
            
            $.each(this.elements(), (i: number, element: EditorObject) => {
                if(element.id().lastIndexOf(prefix) == 0) {
                    let max = parseInt(element.id().replace(prefix, ''));
                    result = max >= result ? max + 1 : result;
                }
            });

            return prefix + result.toString();
        }
    }
}