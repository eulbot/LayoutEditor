module mapp.le {

    export class SelectedObject {

        private object: fabric.IObject;
        private id: KnockoutObservable<string>;
        private name: KnockoutObservable<string>;

        private width: KnockoutObservable<number>;
        private height: KnockoutObservable<number>;
        private left: KnockoutObservable<number>;
        private top: KnockoutObservable<number>; 

        public apply: (object: fabric.IObject) => void;
        public update: () => void;
        public clear: () => void;

        private ws: KnockoutSubscription;

        constructor(object?: fabric.IObject) {
            
            this.id = ko.observable<string>();
            this.name = ko.observable<string>();
            this.width = ko.observable<number>();
            this.height = ko.observable<number>();
            this.left = ko.observable<number>();
            this.top = ko.observable<number>();

            this.apply = (object: fabric.IObject) => {

                this.object = object;
                this.update();

                if(this.ws)
                    this.ws.dispose();

                this.ws = this.width.subscribe(() => {
                    if(this.width() && this.object && this.width() !== this.object.getWidth()) {
                        console.info('canvas <-- selectedObect');
                        console.info(this.width());
                        this.object.setWidth(parseInt(<any>this.width()));
                    }
                });
                // this.height.subscribe(Util.applyProperty(object.setHeight, this.height));
                // this.left.subscribe(Util.applyProperty(object.setLeft, this.left));
                // this.top.subscribe(Util.applyProperty(object.setTop, this.top));
            }

            this.update = () => {
                
                if(this.width() !== this.object.getWidth()) {
                    console.info('canvas --> selectedObect');
                    console.info(this.object.getWidth());
                    this.width(this.object.getWidth());
                }
                // this.height(this.object.getHeight());
                // this.left(this.object.getLeft());
                // this.top(this.object.getTop());
            }

            this.clear = () => {

                Util.setValue(null, this.id, this.name, this.width, this.height, this.left, this.top);
            }

            if(object)
                this.update();
        }
    }
}