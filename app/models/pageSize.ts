module mapp.le {

    export class PageSize {
        private name: string;
        width: number;
        height: number;

        constructor(name: string, width: number, height: number) {
            this.name = name;
            this.width = width;
            this.height = height;            
        }
    }
}