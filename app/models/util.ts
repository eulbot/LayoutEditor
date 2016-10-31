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

        static observeMoving = (eo: EditorObject) => {
            let corner = Util.stayInCanvasWhileMoving(eo);
            Util.unlockPartially(eo, corner);
            Util.snapToObjectsWhenMoving(eo, corner); 
        }

        static stayInCanvasWhileMoving = (eo: EditorObject) => {
            
            eo.unlock();
            let corner: string  = 'trbl';

            if (eo.object.getTop() < Util.snapThreshold) {
                eo.object.setTop(0);
                eo.setPrio(enums.Dimension.Top);
                corner = corner.replace('t', '');
            }
            if (eo.object.getRight() > (Util.canvas.getWidth() - Util.snapThreshold)) {
                eo.object.setLeft(Util.canvas.getWidth() - eo.object.getWidth());
                eo.setPrio(enums.Dimension.Right);
                corner = corner.replace('r', '');
            }
            if (eo.object.getBottom() > (Util.canvas.getHeight() - Util.snapThreshold)) {
                eo.object.setTop(Util.canvas.getHeight() - eo.object.getHeight());
                eo.setPrio(enums.Dimension.Bottom);
                corner = corner.replace('b', '');
            }
            if (eo.object.getLeft() < Util.snapThreshold) {
                eo.object.setLeft(0);
                eo.setPrio(enums.Dimension.Left);
                corner = corner.replace('l', '');
            }

            return corner;
        }

        static snapToObjectsWhenMoving = (eo: EditorObject, corner: string) => {
            
            let snapped = false;
            
            Util.canvas.forEachObject((ref: fabric.IObject) => {

                if(ref.getId() == eo.id() || snapped)
                    return;
                    
                if(eo.object.withinX(ref, Util.snapThreshold, false)) {
                    if(snapY(false))
                        snapX(true, true); 
                }

                if(eo.object.withinY(ref, Util.snapThreshold, false)) {
                     if(snapX(false))
                        snapY(true, true); 
                }

                function snapX(inside: boolean, setPrio?: boolean): boolean {

                    if(eo.object.withinY(ref, Util.snapThreshold, false)) {

                    // Only snap X if not snapped top or bottom to canvas
                        if(corner.indexOf('l') >= 0 && corner.indexOf('r') >= 0) { 
                            if(eo.object.snapLeft(ref, Util.snapThreshold, inside)) {
                                eo.object.setLeft(inside ? ref.getLeft() : ref.getRight());
                                eo.setPrio(enums.Dimension.Left);
                                return true;   
                            }
                            else if(eo.object.snapRight(ref, Util.snapThreshold, inside)) {
                                eo.object.setRight(inside ? ref.getRight() : ref.getLeft());
                                eo.setPrio(enums.Dimension.Right);
                                return true;   
                            }
                        }
                    }
                    return false;
                }
                
                function snapY(inside: boolean, setPrio?: boolean): boolean {
                    
                    // Only snap Y, X if not snapped left or right to canvas
                    if(corner.indexOf('t') >= 0 && corner.indexOf('b') >= 0) {
                        if(eo.object.snapTop(ref, Util.snapThreshold, inside)) {
                            eo.object.setTop(inside ? ref.getTop() : ref.getBottom());
                            eo.setPrio(enums.Dimension.Top);
                            return true;    
                        }
                        else if(eo.object.snapBottom(ref, Util.snapThreshold, inside)) {
                            eo.object.setBottom(inside ? ref.getBottom() : ref.getTop());
                            eo.setPrio(enums.Dimension.Bottom);
                            return true;    
                        }
                    }
                    return false;
                }
            });
        }

        static observeResizing = (eo: EditorObject, corner: string) => {

            Util.unlockPartially(eo, corner);
            let fullySnapped = Util.snapToObjectsWhenResizing(eo, corner);
            if(!fullySnapped) Util.stayInCanvasWhileResizing(eo, corner);
        }

        static stayInCanvasWhileResizing = (eo: EditorObject, corner: string) => {
            

            if(corner.indexOf('t') >= 0 && eo.object.getTop() < Util.snapThreshold) {
                
                eo.reapply(false);
                eo.setPrio(enums.Dimension.Bottom, true);
                eo.top.value(0);
                eo.setPrio(enums.Dimension.Top);
            }
            
            if(corner.indexOf('r') >= 0 && eo.object.getLeft() + eo.object.getWidth() + Util.snapThreshold > Util.getCanvasWidth()) {
                eo.reapply(true);
                eo.setPrio(enums.Dimension.Left, true);
                eo.right.value(0);
                eo.setPrio(enums.Dimension.Right);
            }
            
            if(corner.indexOf('b') >= 0 && eo.object.getTop() + eo.object.getHeight() + Util.snapThreshold > Util.getCanvasHeight()) {
                eo.reapply(false);
                eo.setPrio(enums.Dimension.Top, true);
                eo.bottom.value(0);
                eo.setPrio(enums.Dimension.Bottom);
            }

            if(corner.indexOf('l') >= 0 && eo.object.getLeft() < Util.snapThreshold) {
                eo.reapply(true);
                eo.setPrio(enums.Dimension.Right, true);
                eo.left.value(0);
                eo.setPrio(enums.Dimension.Left);
            }
        }

        static snapToObjectsWhenResizing = (eo: EditorObject, corner: string) => {
            
            let snapped = false;
            let fullySnapped = false;

            Util.canvas.forEachObject((ref: fabric.IObject) => {

                if (ref.getId() == eo.id() || snapped)
                    return;

                if(!fullySnapped)
                    snapX();
                
                if(!fullySnapped)
                    snapY();

                function snapX() {

                    if (eo.object.withinY(ref, Util.snapThreshold)) { 
                        if (corner.indexOf('l') >= 0) {
                            if(eo.object.snapLeft(ref, Util.snapThreshold, true)) {
                                apply(enums.Dimension.Left, ref.getLeft());
                                corner = corner.replace('l', '');
                            }
                            if(eo.object.snapLeft(ref, Util.snapThreshold, false)) {
                                apply(enums.Dimension.Left, ref.getRight());
                                corner = corner.replace('l', '');
                            }
                        }
                        if (corner.indexOf('r') >= 0) { 
                            if(eo.object.snapRight(ref, Util.snapThreshold, true)) {
                                apply(enums.Dimension.Right, Util.getCanvasWidth() - ref.getLeft() - ref.getWidth());
                                corner = corner.replace('r', '');
                            }
                            if(eo.object.snapRight(ref, Util.snapThreshold, false)) {
                                apply(enums.Dimension.Right, Util.getCanvasWidth() - ref.getLeft());
                                corner = corner.replace('r', '');
                            }
                        }
                        fullySnapped = corner.length == 0;
                    }
                }

                function snapY() {

                    if(eo.object.withinX(ref, Util.snapThreshold)) {
                        if (corner.indexOf('t') >= 0) {
                            if (eo.object.snapTop(ref, Util.snapThreshold, true)) {
                                apply(enums.Dimension.Top, ref.getTop());
                                corner = corner.replace('t', '');
                            }
                            if (eo.object.snapTop(ref, Util.snapThreshold, false)) {
                                apply(enums.Dimension.Top, ref.getBottom());
                                corner = corner.replace('t', '');
                            }
                        }
                        if (corner.indexOf('b') >= 0) {
                            if(eo.object.snapBottom(ref, Util.snapThreshold, true)) {
                                apply(enums.Dimension.Bottom, Util.getCanvasHeight() - ref.getTop() - ref.getHeight());
                                corner = corner.replace('b', '');
                            }
                            if(eo.object.snapBottom(ref, Util.snapThreshold, false)) {
                                apply(enums.Dimension.Bottom, Util.getCanvasHeight() - ref.getTop());
                                corner = corner.replace('b', '');
                            }
                        }
                        fullySnapped = corner.length == 0;
                    }
                }
                
                function apply(dimension: enums.Dimension, value) {
                    eo.reapply(Util.isHorizontal(dimension));
                    eo.setPrio(Util.getOppositeDimension(dimension), true);
                    Util.setDimension(eo, dimension, value);
                    eo.setPrio(dimension);
                    return true;
                }
            });
            
            return fullySnapped;
        }

        static unlockPartially (eo: EditorObject, corner: string) {

            if(corner.indexOf('t') > 0) eo.unlock(enums.Dimension.Top);
            if(corner.indexOf('r') > 0) eo.unlock(enums.Dimension.Right);
            if(corner.indexOf('b') > 0) eo.unlock(enums.Dimension.Bottom);
            if(corner.indexOf('l') > 0) eo.unlock(enums.Dimension.Left);
        }

        static setDimension (eo: EditorObject, dimension: enums.Dimension, value: number) {
            switch(dimension) {
                case enums.Dimension.Width:
                    eo.width.value(value);
                    break;
                case enums.Dimension.Height:
                    eo.height.value(value);
                    break;
                case enums.Dimension.Top:
                    eo.top.value(value);
                    break;
                case enums.Dimension.Right:
                    eo.right.value(value);
                    break;
                case enums.Dimension.Bottom:
                    eo.bottom.value(value);
                    break;
                case enums.Dimension.Left:
                    eo.left.value(value);
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

        static moveStep = (eo: EditorObject, direction: enums.Direction, distance?: number) => {

            distance = (distance || 1);
                
                if(Util.isHorizontal(direction))
                    eo.setPrio(enums.Dimension.Width);
                else
                    eo.setPrio(enums.Dimension.Height);

                switch(direction) {
                    case enums.Direction.TOP:
                        eo.top.value(eo.top.value() - distance);
                        break;
                    case enums.Direction.RIGHT:
                        eo.left.value(eo.left.value() + distance);
                        break;
                    case enums.Direction.BOTTOM:
                        eo.top.value(eo.top.value() + distance);
                        break;
                    case enums.Direction.LEFT:
                        eo.left.value(eo.left.value() - distance);
                        break;
                }
        }

        static unlock = (eo: EditorObject) => {
            eo.top.isLocked(false);
            eo.right.isLocked(false);
            eo.bottom.isLocked(false);
            eo.left.isLocked(false);
        }

        static isHorizontal = (dimension: number) => {
            return dimension == 0 || dimension == 3 || dimension == 5;
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