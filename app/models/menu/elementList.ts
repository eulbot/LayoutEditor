/// <reference path="menuEntry.ts" />

module mapp.le {

    export class ElementList extends AMenuEntry {
        
        private editor: Editor;
        private domElementList: KnockoutObservable<HTMLUListElement>;

        constructor(editor: Editor) {
            super();
            this.editor = editor;
            this.domElementList = ko.observable<HTMLUListElement>();

            let elementSubstription: KnockoutSubscription;
            this.isToggled(true);

            elementSubstription = this.domElementList.subscribe(() => {

                if(this.domElementList()) {
                    elementSubstription.dispose();
                    $(this.domElementList()).sortable({ axis: 'y', containment: 'parent', update: this.clearArray});
                    $(this.domElementList()).disableSelection();
                }
            });
        }

        private clearArray = (event: any, ui: any) => {
            var item = ko.dataFor(ui.item[0]),
                newIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]);
            if (newIndex >= this.editor.elements().length) newIndex = this.editor.elements().length - 1;
            if (newIndex < 0) newIndex = 0;
    
            ui.item.remove();
            this.editor.elements.remove(item);
            this.editor.elements.splice(newIndex, 0, item);
        }
    }
}