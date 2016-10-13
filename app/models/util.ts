module mapp.le {
    export class Util {
       
        public static canvas: fabric.ICanvas;
        public static snapThreshold: number = 20;
        public static snap: boolean = true;

        static getCanvasWidth(): number {
            return Util.canvas.getWidth();
        }

        static getCanvasHeight(): number {
            return Util.canvas.getHeight();
        }

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

        static round(value: number) {
            return Math.round((value + 0.00001) * 100) / 100;
        }

        static resizeCanvas(width: number, heigth: number) {
            
            let fx = width / Util.canvas.getWidth();
            let fy = heigth / Util.canvas.getHeight();

            Util.canvas.setWidth(width);
            Util.canvas.setHeight(heigth);

            this.canvas.forEachObject((object: fabric.IObject) => {

                if(!(object.isDimensionAbsolute(Dimension.Width))) 
                    object.setWidth(object.getWidth() * fx);
                if(!(object.isDimensionAbsolute(Dimension.Height))) 
                    object.setHeight(object.getHeight() * fy);
                if(!(object.isDimensionAbsolute(Dimension.Top))) 
                    object.setTop(object.getTop() * fy);
                if(!(object.isDimensionAbsolute(Dimension.Left))) 
                    object.setLeft(object.getLeft() * fx);

                var cw = Util.canvas.getWidth();
                var ch = Util.canvas.getHeight();
                var l = object.getLeft();
                var t = object.getTop();
                var w = object.getWidth();
                var h = object.getHeight();

                let ia = object.isDimensionAbsolute(Dimension.Right);

                if(object.isDimensionAbsolute(Dimension.Left) && object.isDimensionAbsolute(Dimension.Right)) {
                    object.setWidth(cw - l - object.data['Right']['value']);
                }
                else if(object.isDimensionAbsolute(Dimension.Right)) { 
                    object.setLeft(cw - w - object.data['Right']['value']);
                }
                if(object.isDimensionAbsolute(Dimension.Top) && object.isDimensionAbsolute(Dimension.Bottom)) {
                    object.setHeight(ch - t - object.data['Bottom']['value']);
                }
                else if(object.isDimensionAbsolute(Dimension.Bottom)) { 
                    object.setTop(ch - h - object.data['Bottom']['value']);
                } 
                
                object.setScaleX(1);
                object.setScaleY(1);
                object.setCoords();
            });

            Util.canvas.renderAll();
        }

        // Positioning functions
        static stayInCanvas(eventObject: fabric.IEvent, resized?: boolean) {
            
            let object = eventObject.target;
            let event: MouseEvent = <MouseEvent>(eventObject.e);
                     
            object.setCoords();

            //printObject(object);

            if (object.getLeft() < Util.snapThreshold) {
                object.setLeft(0);
            }
            if (object.getTop() < Util.snapThreshold) {
                object.setTop(0);
            }
            if(object.getRight() > (Util.canvas.getWidth() - Util.snapThreshold)) {
                object.setLeft(Util.canvas.getWidth() - object.getWidth());
            }
            if(object.getBottom() > (Util.canvas.getHeight() - Util.snapThreshold)) {
                object.setTop(Util.canvas.getHeight() - object.getHeight());
            }

            function printObject(o: fabric.IObject) {
                console.info('getLeft(): '.concat(o.getLeft().toString().concat(', left: '. concat(o.left.toString()) + '\n')) + 
                'getWidth(): '.concat(o.getWidth().toString().concat(', width: '. concat(o.width.toString()) + '\n')) +
                'scaleX: '.concat(o.scaleX.toString()));
            }
        }

        static snapToObjects(eventObject: fabric.IEvent) {
            
            if(!Util.snap)
                return;

            let object: fabric.IObject = eventObject.target;
            
            this.canvas.forEachObject((ref: fabric.IObject) => {

                if(ref == object)
                    return;

                if(object.withinX(ref, Util.snapThreshold)) {
                    if(snapY(false))
                        snapX(true); 
                }

                if(object.withinY(ref, Util.snapThreshold)) {
                     if(snapX(false))
                        snapY(true); 
                }

                function snapX(inside: boolean): boolean {

                    if(object.snapLeft(ref, Util.snapThreshold, inside)) {
                        object.setLeft(inside ? ref.getLeft() : ref.getRight());
                        return true;    
                    }
                    else if(object.snapRight(ref, Util.snapThreshold, inside)) {
                        object.setRight(inside ? ref.getRight() : ref.getTop());
                        return true;    
                    }

                    return false;
                }
                
                function snapY(inside: boolean): boolean {
                    if(object.snapTop(ref, Util.snapThreshold, inside)) {
                        object.setTop(inside ? ref.getTop() : ref.getBottom());
                        return true;    
                    }
                    else if(object.snapBottom(ref, Util.snapThreshold, inside)) {
                        object.setBottom(inside ? ref.getBottom() : ref.getTop());
                        return true;    
                    }
                    return false;
                }

            });
        }
    }
}