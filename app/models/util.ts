module mapp.ple {
    export class Util {
       public static moveObject = (event: Interact.InteractEvent) => {
            var target: HTMLElement = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            Util.move(target, x, y);
        }

        public static resetObject = (event: Interact.InteractEvent) => {
            var target: HTMLElement = event.target,
                x = 0, y = 0;

            Util.move(target, x, y);
        }

        private static move(target: HTMLElement, x: number, y: number) {
            target.style.webkitTransform =
            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            target.setAttribute('data-x', x.toString());
            target.setAttribute('data-y', y.toString());
        }
    }
}