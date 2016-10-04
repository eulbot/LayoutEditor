module mapp.ple {
    export class Util {
       public static moveObject = (event: Interact.InteractEvent) => {
            var target: HTMLElement = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            
                console.log(y);
            if(y > 300 && y < 340 && event.dy > 0) {
                y = 320;
            }

            Util.move(target, x, y);
        }

        public static resetObject = (event: Interact.InteractEvent) => {
            var target: HTMLElement = event.target,
                x = 0, y = 0;

            Util.move(target, x, y);
        }

        public static resizeObject = (event: any) => {
            var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);
            
            target.style.width  = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';
            
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
        }

        private static move(target: HTMLElement, x: number, y: number) {
            target.style.webkitTransform =
            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            target.setAttribute('data-x', x.toString());
            target.setAttribute('data-y', y.toString());
        }

        public static getOffset(relatedTarget: HTMLElement, target: HTMLElement, offset: Offset) {
            let op =  (<HTMLElement>relatedTarget.offsetParent);
            let tx = parseInt(relatedTarget.getAttribute('data-'.concat(offset == Offset.LEFT ? 'x' : 'y')));
            let opl = offset == Offset.LEFT ? op.offsetLeft : op.offsetTop;
            let ol = offset == Offset.LEFT ? target.offsetLeft : target.offsetTop;
            let bw = offset == Offset.LEFT ? relatedTarget.offsetLeft : relatedTarget.offsetTop;

            return tx + opl - ol - bw - 2;
        }
    }
}