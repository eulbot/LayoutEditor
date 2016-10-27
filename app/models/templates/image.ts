module mapp.le {

    export class Image extends SelectedObject {
    
        public url: KnockoutObservable<string>;

        constructor(editor: Editor) {
            super();
            this.object = editor.canvas.addFrame(DefaultFrameOptions);
            this.url = ko.observable<string>();
        }
    }

}