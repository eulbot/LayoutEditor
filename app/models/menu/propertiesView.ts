/// <reference path="menuEntry.ts" />

module mapp.le {

    export class PropertiesView extends AMenuEntry {
        
        private editor: Editor;
        public iconCss: KnockoutComputed<string>;

        constructor(editor: Editor) {
            super();
            this.editor = editor;
            this.isToggled(false);

            this.iconCss = ko.pureComputed(() => {
                return this.isToggled() ? 'is-active' : '';
            });
        }
    }
}