module mapp.le {
    export class Util {
       
        public static canvas: fabric.ICanvas;
        public static snap: number = 20;

        static getRandomColor() {
            return 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ', 0.75)';
        }

        static setValue(value: any, ...observables: KnockoutObservable<any>[]) {
            observables.forEach(obs => {
                obs(value);
            });
        }

        static applyProperty(property: (value: any) => any, observable: KnockoutObservable<any>): any {
            property(observable());
        }

        // Positioning functions
        static stayInCanvas(eventObject: fabric.IEvent) {
            
            let object = eventObject.target;
            let event: MouseEvent = <MouseEvent>(eventObject.e);
            
            object.setCoords();
            
            if (object.getLeft() < Util.snap) {
                object.setLeft(0);
            }

            if (object.getTop() < Util.snap) {
                object.setTop(0);
            }

            if((object.getWidth() + object.getLeft()) > (Util.canvas.getWidth() - Util.snap)) {
                object.setLeft(Util.canvas.getWidth() - object.getWidth());
            }

            if((object.getHeight() + object.getTop()) > (Util.canvas.getHeight() - Util.snap)) {
                object.setTop(Util.canvas.getHeight() - object.getHeight());
            }
        }

        static snapToObjects(eventObject: fabric.IEvent) {
            
            let object = eventObject.target;
            
            this.canvas.forEachObject((ref: fabric.IObject) => {

                if(ref == object)
                    return;

                // Difference bottom edge smaller < snap
                if(Math.abs((object.getTop() + object.getHeight()) - (ref.getTop() + ref.getHeight())) < Util.snap) {

                    // Difference right of ref and left of object < snap
                    if(Math.abs(object.getLeft() - (ref.getLeft() + ref.getWidth())) < Util.snap) {
                        object.setLeft(ref.getLeft() + ref.getWidth());
                        object.setTop(ref.getTop() + ref.getHeight() - object.getHeight());
                    }

                    // Difference right of object and left of ref < snap
                    if(Math.abs((object.getLeft() + object.getWidth()) - ref.getLeft()) < Util.snap) {
                        object.setLeft(ref.getLeft() - object.getWidth());
                        object.setTop(ref.getTop() + ref.getHeight() - object.getHeight());
                    }
                }

                // Difference top edge smaller < snap
                if(Math.abs(object.getTop() - ref.getTop()) < Util.snap) {

                    // Difference right of ref and left of object < snap
                    if(Math.abs(object.getLeft() - (ref.getLeft() + ref.getWidth())) < Util.snap) {
                        object.setLeft(ref.getLeft() + ref.getWidth());
                        object.setTop(ref.getTop());
                    }

                    // Difference right of object and left of ref < snap
                    if(Math.abs((object.getLeft() + object.getWidth()) - ref.getLeft()) < Util.snap) {
                        object.setLeft(ref.getLeft() - object.getWidth());
                        object.setTop(ref.getTop());
                    }
                }

                // Difference right edge smaller < snap
                if(Math.abs((object.getLeft() + object.getWidth()) - (ref.getLeft() + ref.getWidth())) < Util.snap) {
                    
                    // Difference bottom of ref and top of object < snap
                    if(Math.abs(object.getTop() - (ref.getTop() + ref.getHeight())) < Util.snap) {
                        object.setLeft(ref.getLeft() + ref.getWidth() - object.getWidth());
                        object.setTop(ref.getTop() + ref.getHeight());
                    }
                    
                    // Difference bottom of object and bottom of object < snap
                    if(Math.abs((object.getTop() + object.getHeight()) - ref.getTop()) < Util.snap) {
                        object.setLeft(ref.getLeft() + ref.getWidth() - object.getWidth());
                        object.setTop(ref.getTop() - object.getHeight());
                    }
                }

                
                // Difference left edge smaller < snap
                if(Math.abs(object.getLeft() - ref.getLeft()) < Util.snap) {
                    // Util.snap target TL to object BL
                    if(Math.abs(object.getTop() - (ref.getTop() + ref.getHeight())) < Util.snap) {
                        object.setLeft(ref.getLeft());
                        object.setTop(ref.getTop() + ref.getHeight());
                    }

                    // Util.snap target BL to object TL
                    if(Math.abs((object.getTop() + object.getHeight()) - ref.getTop()) < Util.snap) {
                        object.setLeft(ref.getLeft());
                        object.setTop(ref.getTop() - object.getHeight());
                    }
                }
            });
        }
    }
}