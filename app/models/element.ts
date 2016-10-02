module mapp.ple {

    export abstract class Element {
        
        private static counter: number = 0;

        private _id: KnockoutObservable<string>;
        private wrapper: string;

        private x: KnockoutObservable<number>;
        private y: KnockoutObservable<number>;

        public abstract createInstance(): Element;

        public position: () => KnockoutComputed<String>;
        public setPosition: (x: number, y: number) => void;
        public copyPosition: (target: Element) => void;

        get Id() : string {
            return this._id();
        }

        constructor(isMenuItem?: boolean) {
            Element.counter++;
        
            this._id = ko.observable('mapp-ple-element-'.concat(Element.counter.toString()));
            this.wrapper = 'element-template';
        
            this.x = ko.observable<number>(0);
            this.y = ko.observable<number>(1);

            this.x.subscribe(() => {
                console.log('x changed');
            });

            this.position = () => ko.computed(() => {

                let pos: string;

                if(this.x() && this.y())
                    pos = this.x().toString().concat('px, ', this.y().toString(), 'px');
                else
                    pos = '0, 0';

                console.info('pos for +' + this.Id + ': ' + 'translate(' + pos + ')');

                return 'translate(' + pos + ')';
            });

            this.setPosition = (x: number, y: number) => {
                this.x(x);
                this.y(y);
            }

            this.copyPosition = (target: Element) => {
                this.setPosition(target.x(), target.y());
            }
        }
    }
}