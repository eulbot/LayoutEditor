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

        public cloneObject = (e: fabric.IEvent) => {

            let element = this.getElementByObject(e.target);
            let serialized = element.serialize();
            let newElement = EditorObject.newInstance(serialized.type);
            let clonedObject = fabric.util.object.clone(e.target);

            serialized.id = this.getNextId(Util.getClassName(element));
            serialized.name = serialized.name.concat('.', this.getNextId(serialized.name.concat('.')).toString());
            newElement.deserialize(serialized);
            Util.canvas.add(clonedObject);
            (<any>Util.canvas)._setupCurrentTransform(e.e, clonedObject);
            newElement.object = clonedObject;

            this.elements.splice(this.elements.indexOf(element), 0, newElement);
            this.selectElement(newElement);
        }

        public selectElement = (element: EditorObject | fabric.IObject) => {

            if(!(element instanceof EditorObject)) 
                this.selectedElement(this.getElementByObject(element));
            else
                this.selectedElement(element);

            this.canvas.selectObject(this.selectedElement().object);
        };

        public removeElement = (element: EditorObject) => {
            this.canvas.removeObject(element.object);
            this.elements.remove(element);
            this.clearSelection();
        }

        public resize = (width: number, height: number) => {
            Util.resizeCanvas(this.elements(), width, height);
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