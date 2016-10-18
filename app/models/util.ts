module mapp.le {
    export class Util {
       
        public static canvas: fabric.ICanvas;
        public static snapThreshold: number = 8;
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

            Util.canvas.forEachObject((object: fabric.IObject) => {

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

        static stayInCanvasWhileMoving = (so: SelectedObject) => {
            
            if (so.object.getLeft() < Util.snapThreshold) {
                so.object.setLeft(0);
                so.setPrio(Dimension.Left);
            }
            if (so.object.getTop() < Util.snapThreshold) {
                so.object.setTop(0);
                so.setPrio(Dimension.Top);
            }
            if (so.object.getRight() > (Util.canvas.getWidth() - Util.snapThreshold)) {
                so.object.setLeft(Util.canvas.getWidth() - so.object.getWidth());
                so.setPrio(Dimension.Right);
            }
            if (so.object.getBottom() > (Util.canvas.getHeight() - Util.snapThreshold)) {
                so.object.setTop(Util.canvas.getHeight() - so.object.getHeight());
                so.setPrio(Dimension.Bottom);
            }
        }

        static snapToObjectsWhenMoving = (so: SelectedObject) => {
            
            if(!Util.snap)
                return;
            
            Util.canvas.forEachObject((ref: fabric.IObject) => {

                if(ref.getId() == so.id())
                    return;

                if(so.object.withinX(ref, Util.snapThreshold, false)) {
                    if(snapY(false))
                        snapX(true, true); 
                }

                if(so.object.withinY(ref, Util.snapThreshold, false)) {
                     if(snapX(false))
                        snapY(true, true); 
                }

                function snapX(inside: boolean, setPrio?: boolean): boolean {

                    if(so.object.snapLeft(ref, Util.snapThreshold, inside)) {
                        so.object.setLeft(inside ? ref.getLeft() : ref.getRight());
                        if(setPrio) (so.setPrio(Dimension.Left));
                        return true;    
                    }
                    else if(so.object.snapRight(ref, Util.snapThreshold, inside)) {
                        so.object.setRight(inside ? ref.getRight() : ref.getLeft());
                        if(setPrio) (so.setPrio(Dimension.Right));
                        return true;    
                    }
                    return false;
                }
                
                function snapY(inside: boolean, setPrio?: boolean): boolean {
                    if(so.object.snapTop(ref, Util.snapThreshold, inside)) {
                        so.object.setTop(inside ? ref.getTop() : ref.getBottom());
                        if(setPrio) (so.setPrio(Dimension.Top));
                        return true;    
                    }
                    else if(so.object.snapBottom(ref, Util.snapThreshold, inside)) {
                        so.object.setBottom(inside ? ref.getBottom() : ref.getTop());
                        if(setPrio) (so.setPrio(Dimension.Bottom));
                        return true;    
                    }
                    return false;
                }
            });
        }

        static stayInCanvasWhileResizing = (so: SelectedObject, corner: string) => {
            if(corner.indexOf('t') >= 0 && so.object.getTop() < Util.snapThreshold) {
                so.reapply(false);
                so.setPrio(Dimension.Bottom);
                so.top.value(0);
                so.setPrio(Dimension.Top);
            }
            
            if(corner.indexOf('r') >= 0 && so.object.getLeft() + so.object.getWidth() + Util.snapThreshold > Util.getCanvasWidth()) {
                so.reapply(true);
                so.setPrio(Dimension.Left);
                so.right.value(0);
                so.setPrio(Dimension.Right);
            }
            
            if(corner.indexOf('b') >= 0 && so.object.getTop() + so.object.getHeight() + Util.snapThreshold > Util.getCanvasHeight()) {
                so.reapply(false);
                so.setPrio(Dimension.Top);
                so.bottom.value(0);
                so.setPrio(Dimension.Bottom);
            }

            if(corner.indexOf('l') >= 0 && so.object.getLeft() < Util.snapThreshold) {
                so.reapply(true);
                so.setPrio(Dimension.Right);
                so.left.value(0);
                so.setPrio(Dimension.Left);
            }
        }

        static snapToObjectsWhenResizing = (so: SelectedObject, corner: string) => {
            
            Util.canvas.forEachObject((ref: fabric.IObject) => {

                if (ref.getId() == so.id())
                    return;

                if (corner.indexOf('t') >= 0) {
                    if (so.object.withinX(ref, Util.snapThreshold) && so.object.snapTop(ref, Util.snapThreshold, false)) {
                        so.reapply(false);
                        so.setPrio(Dimension.Bottom);
                        so.top.value(ref.getBottom());
                        so.setPrio(Dimension.Top);
                    }
                }

                if (corner.indexOf('r') >= 0) {
                    if (so.object.withinY(ref, Util.snapThreshold) && so.object.snapRight(ref, Util.snapThreshold, false)) {
                        so.reapply(true);
                        so.setPrio(Dimension.Left);
                        so.right.value(Util.getCanvasWidth() - ref.getLeft());
                        so.setPrio(Dimension.Right);
                    }
                }

                if(corner.indexOf('b') >= 0) {
                    if(so.object.withinX(ref, Util.snapThreshold) && so.object.snapBottom(ref, Util.snapThreshold, false)) {
                        so.reapply(false);
                        so.setPrio(Dimension.Top);
                        so.bottom.value(Util.getCanvasHeight() - ref.getTop());
                        so.setPrio(Dimension.Bottom);
                    }
                }

                if(corner.indexOf('l') >= 0) {
                    if(so.object.withinY(ref, Util.snapThreshold) && so.object.snapLeft(ref, Util.snapThreshold, false)) {
                        so.reapply(true);
                        so.setPrio(Dimension.Right);
                        so.left.value(ref.getRight());
                        so.setPrio(Dimension.Left);
                    }
                }
            });
        }

        static moveStep = (so: SelectedObject, direction: Direction, distance?: number) => {

            distance = (distance || 1);
                
                if(Util.isHorizontal(direction))
                    so.setPrio(Dimension.Width);
                else
                    so.setPrio(Dimension.Height);

                switch(direction) {
                    case Direction.TOP:
                        so.top.value(so.top.value() - distance);
                        break;
                    case Direction.RIGHT:
                        so.left.value(so.left.value() + distance);
                        break;
                    case Direction.BOTTOM:
                        so.top.value(so.top.value() + distance);
                        break;
                    case Direction.LEFT:
                        so.left.value(so.left.value() - distance);
                        break;
                }
        }

        static isHorizontal = (dimension: number) => {
            return dimension == 0 || dimension == 3 || dimension == 5;
        }
    }
}