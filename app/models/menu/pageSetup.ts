module mapp.le {

    export class PageSetup extends AMenuEntry implements ISerializable<IPageSizeData> {
        
        private editor: Editor;
        private width: KnockoutObservable<number>;
        private height: KnockoutObservable<number>;
        private dpi: KnockoutObservable<number>;
        
        defaultPageSizes: KnockoutObservableArray<IPageSize>;
        selectedPageSize: KnockoutObservable<IPageSize>;
        selectedDPI: KnockoutObservable<string>;
        isCustomPageSize: KnockoutObservable<boolean>;
        isCustomDPI: KnockoutObservable<boolean>;

        private init: () => void;
        public savePageSize: () => void;

        constructor(editor: Editor) {
            
            super();
            this.width = ko.observable<number>();
            this.height = ko.observable<number>();
            this.dpi = ko.observable<number>();
            this.editor = editor;

            this.defaultPageSizes = ko.observableArray<IPageSize>(Util.defaultPageSizes());
            this.selectedPageSize = ko.observable<IPageSize>();
            this.selectedDPI = ko.observable<string>();
            this.isCustomPageSize = ko.observable<boolean>(false);
            this.isCustomDPI = ko.observable<boolean>(false);
            this.isToggled = ko.observable<boolean>(false);

            this.init = () => {

                this.selectedPageSize(this.defaultPageSizes()[4]);
                this.selectedDPI("72");
                this.setPageSize();
                Util.subscribe([this.width, this.height, this.dpi], this.updateCanvas, 50);
            }

            this.init();
        }

        private setPageSize = () => {
                    
            if(!(this.isCustomPageSize())) {
                this.width(Util.getDefaultPageSize(this.selectedPageSize().id).width);
                this.height(Util.getDefaultPageSize(this.selectedPageSize().id).height);
            }

            if(!(this.isCustomDPI())) {
                this.dpi(parseInt(this.selectedDPI()));
            }
        }

        private updateCanvas = () => {

            let newWidth = this.width() / 25.4 * this.dpi();
            let newHeight = this.height() / 25.4 * this.dpi();

            this.editor.resize(newWidth, newHeight);
        }

        serialize = (): IPageSizeData => {
            return {
                width: this.width(),
                height: this.height(),
                dpi: this.dpi()
            };
        }

        deserialize = (pageSizeData: IPageSizeData) => {
            this.width(pageSizeData.width);
            this.height(pageSizeData.height);
            this.dpi(pageSizeData.dpi);
        }
        
    }
}