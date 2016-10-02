module mapp.ple {

    export class Frame extends Element {

        private template: string;
        
        constructor() {
            super();    
            this.template = 'frame-template';
        }

        public createInstance(): Element {
            return new Frame();
        };

    }
}