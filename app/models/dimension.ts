module mapp.le {

    export class Dimension {
        public value: KnockoutObservable<number>;
        public displayValue: KnockoutComputed<number>;
        private showRelative: KnockoutObservable<boolean>;
        private isAbsolute: KnockoutObservable<boolean>;
        constructor(getAbsolute: () => number) {

            this.value = ko.observable<number>();
            this.isAbsolute = ko.observable<boolean>(false);
            this.showRelative = ko.observable<boolean>(false);

            this.displayValue = ko.pureComputed({
                read: () => {
                    
                    let result: any = this.value() !== undefined ? this.showRelative() ? (this.value() / getAbsolute() * 100).toFixed(2) + '%' : this.value().toString() + 'px' : undefined;
                    
                    if(this.showRelative())
                        this.isAbsolute(false);

                    return result;
                },
                write: (value: string) => {

                    if(value) {
                        let parsed = parseFloat(value.replace(/[^\.\d]/g, ""));
                        let result: number = this.showRelative() ? getAbsolute() * parsed / 100: parsed;
                        this.value(result);
                    }
                }
            });
        }
    }
}