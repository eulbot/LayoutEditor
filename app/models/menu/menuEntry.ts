module mapp.le {

    export abstract class AMenuEntry {
        
        isToggled: KnockoutObservable<boolean>;
        public css: KnockoutComputed<string>;

        constructor() {
      
            this.isToggled = ko.observable<boolean>(false);
            
            this.css = ko.pureComputed(() => {
                return this.isToggled() ? 'toggled' : '';
            });
        }
    }
}