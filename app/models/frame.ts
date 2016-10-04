module mapp.le {

    export class Frame extends Element implements IElement {

        css: KnockoutComputed<string>;
        
        constructor() {
            super();    
            this.css = ko.computed(() => 'frame');
        }

        public createInstance(): Element {
            return new Frame();
        };

    }
}