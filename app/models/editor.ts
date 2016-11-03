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
            
            let elementType = Util.getClassName(element);
            let nextId = this.getNextId(elementType);
            element.id(nextId);
            element.name(elementType + nextId);

            this.elements.push(element);
            element.apply(this.canvas.addFrame(DefaultFrameOptions));
            
            this.selectElement(element);
            this.propertiesView.isToggled(true);
        };

        public addClonedObject = (source: fabric.IObject, clone: fabric.IObject) => {

            let element = this.getElementByObject(source);
            let cloned: EditorObject = ko['mapping'].fromJS(ko.toJS(element));
            
            
            cloned.id(this.getNextId(Util.getClassName(element)));
            cloned.name(element.name() + 'copy');

            this.elements.splice(this.elements.indexOf(element), 0, cloned);
            this.selectedElement(cloned);
        }

        public selectElement = (element: EditorObject | fabric.IObject) => {

            if(!(element instanceof EditorObject)) 
                this.selectedElement(this.getElementByObject(element));
            else
                this.selectedElement(element);

            this.canvas.selectObject(this.selectedElement().object);
        };

        public removeElement = (element: EditorObject) => {
            this.canvas.removeObject(element.object.getId());
            this.elements.remove(element);
            this.clearSelection();
        }

        public clearSelection = () => {
            this.selectedElement(new EditorObject());
        };

        private getNextId = (prefix: string): number => {

            let result = 1;
            
            $.each(this.elements(), (i: number, element: EditorObject) => {
                if(element.name().lastIndexOf(prefix) == 0) {
                    let max = parseInt(element.name().replace(prefix, ''));
                    result = max >= result ? max + 1 : result;
                }
            });

            return result;
        }

        private getElementByObject = (object: fabric.IObject): EditorObject => {

            let result: EditorObject = undefined;

            $.each(this.elements(), (i: number, element: EditorObject) => {
                if(element.object && element.object == object) {
                    result = element;
                    return false;
                }
            });

            return result;
        };

        private getElementById = (id: number) => {

            let result: EditorObject = undefined;

            $.each(this.elements(), (i: number, element: EditorObject) => {
                if(element.object && element.object.getId() == id) {
                    result = element;
                    return false;
                }
            });

            return result;
        };
    }
}