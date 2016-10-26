module mapp.le {

    export class TemplateList implements IMenuEntry {
        isToggled: KnockoutObservable<boolean>;
        public css: KnockoutComputed<string>;

        constructor() {
      
            this.isToggled = ko.observable<boolean>(true);

            this.css = ko.pureComputed(() => {
                return this.isToggled() ? 'toggled' : '';
            });
        }
    }
}