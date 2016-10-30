/// <reference path="menuEntry.ts" />

module mapp.le {

    export class ElementList extends AMenuEntry {
        
        private editor: Editor;

        constructor(editor: Editor) {
            super();
            this.editor = editor;
            this.isToggled(true);
        }
    }
}