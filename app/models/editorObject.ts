module mapp {

    export class EditorObject {
        
        private id: KnockoutObservable<number>;
        private static counter: number = 0;

        constructor() {
            EditorObject.counter++;
            this.id = ko.observable(EditorObject.counter);
        }
    }
}