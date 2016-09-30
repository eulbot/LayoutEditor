module mapp {

    export class Frame extends EditorObject implements IEditorObject {

        template: string;
        
        constructor() {
            super();
            this.template = 'frame-template';
        }
    }
}