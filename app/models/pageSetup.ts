module mapp.le {

    export class PageSetup implements IMenuEntry {
        private width: KnockoutObservable<number>;
        private height: KnockoutObservable<number>;
        private dpi: KnockoutObservable<number>;
        
        defaultPageSizes: KnockoutObservableArray<IPageSize>;
        selectedPageSize: KnockoutObservable<IPageSize>;
        selectedDPI: KnockoutObservable<string>;
        isCustomPageSize: KnockoutObservable<boolean>;
        isCustomDPI: KnockoutObservable<boolean>;
        isToggled: KnockoutObservable<boolean>;

        private init: () => void;
        public setPageSize: () => void;
        public savePageSize: () => void;
        public css: KnockoutComputed<string>;

        constructor() {
            
            this.width = ko.observable<number>();
            this.height = ko.observable<number>();
            this.dpi = ko.observable<number>();
            
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
            }

            this.setPageSize = () => {
                    
                if(!(this.isCustomPageSize())) {
                    this.width(Util.getDefaultPageSize(this.selectedPageSize().id).width);
                    this.height(Util.getDefaultPageSize(this.selectedPageSize().id).height);
                }

                if(!(this.isCustomDPI())) {
                    this.dpi(parseInt(this.selectedDPI()));
                }
            }

            this.savePageSize = () => {

                // TODO Persist page size and apply to Util
                //Util.resizeCanvas
            }

            this.css = ko.pureComputed(() => {
                return this.isToggled() ? 'toggled' : '';
            });

            this.init();
        }
    }
}