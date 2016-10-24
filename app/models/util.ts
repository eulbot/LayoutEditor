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

        static resizeCanvas(width: number, heigth: number) {
            
            let fx = width / Util.canvas.getWidth();
            let fy = heigth / Util.canvas.getHeight();

            Util.canvas.setWidth(width);
            Util.canvas.setHeight(heigth);

            Util.canvas.forEachObject((object: fabric.IObject) => {

                if(!(object.isDimensionLocked(enums.Dimension.Width))) 
                    object.setWidth(object.getWidth() * fx);
                if(!(object.isDimensionLocked(enums.Dimension.Height))) 
                    object.setHeight(object.getHeight() * fy);
                if(!(object.isDimensionLocked(enums.Dimension.Top))) 
                    object.setTop(object.getTop() * fy);
                if(!(object.isDimensionLocked(enums.Dimension.Left))) 
                    object.setLeft(object.getLeft() * fx);

                var cw = Util.canvas.getWidth();
                var ch = Util.canvas.getHeight();
                var l = object.getLeft();
                var t = object.getTop();
                var w = object.getWidth();
                var h = object.getHeight();

                let ia = object.isDimensionLocked(enums.Dimension.Right);

                if(object.isDimensionLocked(enums.Dimension.Left) && object.isDimensionLocked(enums.Dimension.Right)) {
                    object.setWidth(cw - l - object.data['Right']['value']);
                }
                else if(object.isDimensionLocked(enums.Dimension.Right)) { 
                    object.setLeft(cw - w - object.data['Right']['value']);
                }
                if(object.isDimensionLocked(enums.Dimension.Top) && object.isDimensionLocked(enums.Dimension.Bottom)) {
                    object.setHeight(ch - t - object.data['Bottom']['value']);
                }
                else if(object.isDimensionLocked(enums.Dimension.Bottom)) { 
                    object.setTop(ch - h - object.data['Bottom']['value']);
                } 
                
                object.setScaleX(1);
                object.setScaleY(1);
                object.setCoords();
            });

            Util.canvas.renderAll();
        }

        static observeMoving = (so: SelectedObject) => {
            let corner = Util.stayInCanvasWhileMoving(so);
            Util.unlockPartially(so, corner);
            Util.snapToObjectsWhenMoving(so, corner); 
        }

        static stayInCanvasWhileMoving = (so: SelectedObject) => {
            
            so.unlock();
            let corner: string  = 'trbl';

            if (so.object.getTop() < Util.snapThreshold) {
                so.object.setTop(0);
                so.setPrio(enums.Dimension.Top);
                corner = corner.replace('t', '');
            }
            if (so.object.getRight() > (Util.canvas.getWidth() - Util.snapThreshold)) {
                so.object.setLeft(Util.canvas.getWidth() - so.object.getWidth());
                so.setPrio(enums.Dimension.Right);
                corner = corner.replace('r', '');
            }
            if (so.object.getBottom() > (Util.canvas.getHeight() - Util.snapThreshold)) {
                so.object.setTop(Util.canvas.getHeight() - so.object.getHeight());
                so.setPrio(enums.Dimension.Bottom);
                corner = corner.replace('b', '');
            }
            if (so.object.getLeft() < Util.snapThreshold) {
                so.object.setLeft(0);
                so.setPrio(enums.Dimension.Left);
                corner = corner.replace('l', '');
            }

            return corner;
        }

        static snapToObjectsWhenMoving = (so: SelectedObject, corner: string) => {
            
            let snapped = false;
            
            Util.canvas.forEachObject((ref: fabric.IObject) => {

                if(ref.getId() == so.id() || snapped)
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

                    if(so.object.withinY(ref, Util.snapThreshold, false)) {

                    // Only snap X if not snapped top or bottom to canvas
                        if(corner.indexOf('l') >= 0 && corner.indexOf('r') >= 0) { 
                            if(so.object.snapLeft(ref, Util.snapThreshold, inside)) {
                                so.object.setLeft(inside ? ref.getLeft() : ref.getRight());
                                so.setPrio(enums.Dimension.Left);
                                return true;   
                            }
                            else if(so.object.snapRight(ref, Util.snapThreshold, inside)) {
                                so.object.setRight(inside ? ref.getRight() : ref.getLeft());
                                so.setPrio(enums.Dimension.Right);
                                return true;   
                            }
                        }
                    }
                    return false;
                }
                
                function snapY(inside: boolean, setPrio?: boolean): boolean {
                    
                    // Only snap Y, X if not snapped left or right to canvas
                    if(corner.indexOf('t') >= 0 && corner.indexOf('b') >= 0) {
                        if(so.object.snapTop(ref, Util.snapThreshold, inside)) {
                            so.object.setTop(inside ? ref.getTop() : ref.getBottom());
                            so.setPrio(enums.Dimension.Top);
                            return true;    
                        }
                        else if(so.object.snapBottom(ref, Util.snapThreshold, inside)) {
                            so.object.setBottom(inside ? ref.getBottom() : ref.getTop());
                            so.setPrio(enums.Dimension.Bottom);
                            return true;    
                        }
                    }
                    return false;
                }
            });
        }

        static observeResizing = (so: SelectedObject, corner: string) => {

            Util.unlockPartially(so, corner);
            let fullySnapped = Util.snapToObjectsWhenResizing(so, corner);
            if(!fullySnapped) Util.stayInCanvasWhileResizing(so, corner);
        }

        static stayInCanvasWhileResizing = (so: SelectedObject, corner: string) => {
            

            if(corner.indexOf('t') >= 0 && so.object.getTop() < Util.snapThreshold) {
                
                so.reapply(false);
                so.setPrio(enums.Dimension.Bottom, true);
                so.top.value(0);
                so.setPrio(enums.Dimension.Top);
            }
            
            if(corner.indexOf('r') >= 0 && so.object.getLeft() + so.object.getWidth() + Util.snapThreshold > Util.getCanvasWidth()) {
                so.reapply(true);
                so.setPrio(enums.Dimension.Left, true);
                so.right.value(0);
                so.setPrio(enums.Dimension.Right);
            }
            
            if(corner.indexOf('b') >= 0 && so.object.getTop() + so.object.getHeight() + Util.snapThreshold > Util.getCanvasHeight()) {
                so.reapply(false);
                so.setPrio(enums.Dimension.Top, true);
                so.bottom.value(0);
                so.setPrio(enums.Dimension.Bottom);
            }

            if(corner.indexOf('l') >= 0 && so.object.getLeft() < Util.snapThreshold) {
                so.reapply(true);
                so.setPrio(enums.Dimension.Right, true);
                so.left.value(0);
                so.setPrio(enums.Dimension.Left);
            }
        }

        static snapToObjectsWhenResizing = (so: SelectedObject, corner: string) => {
            
            let snapped = false;
            let fullySnapped = false;

            Util.canvas.forEachObject((ref: fabric.IObject) => {

                if (ref.getId() == so.id() || snapped)
                    return;

                if(!fullySnapped)
                    snapX();
                
                if(!fullySnapped)
                    snapY();

                function snapX() {

                    if (so.object.withinY(ref, Util.snapThreshold)) { 
                        if (corner.indexOf('l') >= 0) {
                            if(so.object.snapLeft(ref, Util.snapThreshold, true)) {
                                apply(enums.Dimension.Left, ref.getLeft());
                                corner = corner.replace('l', '');
                            }
                            if(so.object.snapLeft(ref, Util.snapThreshold, false)) {
                                apply(enums.Dimension.Left, ref.getRight());
                                corner = corner.replace('l', '');
                            }
                        }
                        if (corner.indexOf('r') >= 0) { 
                            if(so.object.snapRight(ref, Util.snapThreshold, true)) {
                                apply(enums.Dimension.Right, Util.getCanvasWidth() - ref.getLeft() - ref.getWidth());
                                corner = corner.replace('r', '');
                            }
                            if(so.object.snapRight(ref, Util.snapThreshold, false)) {
                                apply(enums.Dimension.Right, Util.getCanvasWidth() - ref.getLeft());
                                corner = corner.replace('r', '');
                            }
                        }
                        fullySnapped = corner.length == 0;
                    }
                }

                function snapY() {

                    if(so.object.withinX(ref, Util.snapThreshold)) {
                        if (corner.indexOf('t') >= 0) {
                            if (so.object.snapTop(ref, Util.snapThreshold, true)) {
                                apply(enums.Dimension.Top, ref.getTop());
                                corner = corner.replace('t', '');
                            }
                            if (so.object.snapTop(ref, Util.snapThreshold, false)) {
                                apply(enums.Dimension.Top, ref.getBottom());
                                corner = corner.replace('t', '');
                            }
                        }
                        if (corner.indexOf('b') >= 0) {
                            if(so.object.snapBottom(ref, Util.snapThreshold, true)) {
                                apply(enums.Dimension.Bottom, Util.getCanvasHeight() - ref.getTop() - ref.getHeight());
                                corner = corner.replace('b', '');
                            }
                            if(so.object.snapBottom(ref, Util.snapThreshold, false)) {
                                apply(enums.Dimension.Bottom, Util.getCanvasHeight() - ref.getTop());
                                corner = corner.replace('b', '');
                            }
                        }
                        fullySnapped = corner.length == 0;
                    }
                }
                
                function apply(dimension: enums.Dimension, value) {
                    so.reapply(Util.isHorizontal(dimension));
                    so.setPrio(Util.getOppositeDimension(dimension), true);
                    Util.setDimension(so, dimension, value);
                    so.setPrio(dimension);
                    return true;
                }
            });
            
            return fullySnapped;
        }

        static unlockPartially (so: SelectedObject, corner: string) {

            if(corner.indexOf('t') > 0) so.unlock(enums.Dimension.Top);
            if(corner.indexOf('r') > 0) so.unlock(enums.Dimension.Right);
            if(corner.indexOf('b') > 0) so.unlock(enums.Dimension.Bottom);
            if(corner.indexOf('l') > 0) so.unlock(enums.Dimension.Left);
        }

        static setDimension (so: SelectedObject, dimension: enums.Dimension, value: number) {
            switch(dimension) {
                case enums.Dimension.Width:
                    so.width.value(value);
                    break;
                case enums.Dimension.Height:
                    so.height.value(value);
                    break;
                case enums.Dimension.Top:
                    so.top.value(value);
                    break;
                case enums.Dimension.Right:
                    so.right.value(value);
                    break;
                case enums.Dimension.Bottom:
                    so.bottom.value(value);
                    break;
                case enums.Dimension.Left:
                    so.left.value(value);
                    break;
            }
        }

        static getOppositeDimension(dimension: enums.Dimension) {

            switch(dimension) {
                case enums.Dimension.Top:
                    return enums.Dimension.Bottom;
                case enums.Dimension.Right:
                    return enums.Dimension.Left;
                case enums.Dimension.Bottom:
                    return enums.Dimension.Top;
                case enums.Dimension.Left:
                    return enums.Dimension.Right;
            }

            return dimension;
        }

        static moveStep = (so: SelectedObject, direction: enums.Direction, distance?: number) => {

            distance = (distance || 1);
                
                if(Util.isHorizontal(direction))
                    so.setPrio(enums.Dimension.Width);
                else
                    so.setPrio(enums.Dimension.Height);

                switch(direction) {
                    case enums.Direction.TOP:
                        so.top.value(so.top.value() - distance);
                        break;
                    case enums.Direction.RIGHT:
                        so.left.value(so.left.value() + distance);
                        break;
                    case enums.Direction.BOTTOM:
                        so.top.value(so.top.value() + distance);
                        break;
                    case enums.Direction.LEFT:
                        so.left.value(so.left.value() - distance);
                        break;
                }
        }

        static unlock = (so: SelectedObject) => {
            so.top.isLocked(false);
            so.right.isLocked(false);
            so.bottom.isLocked(false);
            so.left.isLocked(false);
        }

        static isHorizontal = (dimension: number) => {
            return dimension == 0 || dimension == 3 || dimension == 5;
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

        static getDefaultPageSize(id: number): IPageSize {
            let result: IPageSize = undefined;

            Util.defaultPageSizes().forEach((pageSize: IPageSize) => {
                if(pageSize.id == id)
                    result = pageSize;
            });

            return result;
        }

        static defaultPageSizes(): IPageSize[] {
            let result: IPageSize[] = [];

            result.push(<IPageSize>{
                id: 0, name: 'A2', width: 420, height: 594
            });
            result.push(<IPageSize>{
                id: 1, name: 'A2 Landscape', width: 594, height: 420
            });
            result.push(<IPageSize>{
                id: 2, name: 'A3', width: 297, height: 420
            });
            result.push(<IPageSize>{
                id: 3, name: 'A3 Landscape', width: 420, height: 297
            });
            result.push(<IPageSize>{
                id: 4, name: 'A4', width: 210, height: 297
            });
            result.push(<IPageSize>{
                id: 5, name: 'A4 Landscape', width: 297, height: 210
            });

            return result;
        }
    }
}