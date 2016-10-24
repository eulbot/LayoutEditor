module mapp.le {

    export class PageSetup {
        width: KnockoutObservable<number>;
        height: KnockoutObservable<number>;
        dpi: KnockoutObservable<number>;
        
        selectedPageSize: KnockoutObservable<IPageSize>;
        isCustomPageSize: KnockoutObservable<boolean>;
        isCustomDPI: KnockoutObservable<boolean>;

        private init: () => void;
        public setPageSize: () => void;

        constructor() {
            
            this.width = ko.observable<number>();
            this.height = ko.observable<number>();
            
            this.selectedPageSize = ko.observable<IPageSize>();
            this.isCustomPageSize = ko.observable<boolean>(false);
            this.isCustomDPI = ko.observable<boolean>(false);

            this.setPageSize = () => {
                    
                if(!(this.isCustomPageSize())) {
                    this.width(Util.getDefaultPageSize(this.selectedPageSize().id).width);
                    this.height(Util.getDefaultPageSize(this.selectedPageSize().id).height);
                }
            }

            this.init = () => {
                
                // Preselect A4-Portrait
                this.selectedPageSize(Util.getDefaultPageSize(4));
                this.setPageSize();
            }

            this.init();
        }
    }
}