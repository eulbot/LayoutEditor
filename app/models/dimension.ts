module mapp.le {

    export class DimensionData {
        public value: KnockoutObservable<number>;
        public displayValue: KnockoutComputed<number>;
        public showRelative: KnockoutObservable<boolean>;
        public isAbsolute: KnockoutObservable<boolean>;
        public hasChanges: KnockoutComputed<boolean>;
        public isComputed: KnockoutComputed<boolean>;
        public lastSet: KnockoutObservable<boolean>;
        public getData: KnockoutComputed<IDimensionData>;
        public setData: (data: any) => any;

        constructor(getAbsolute: () => number) {
            
            this.value = ko.observable<number>();
            this.isAbsolute = ko.observable<boolean>(false);
            this.showRelative = ko.observable<boolean>(false);
            this.lastSet = ko.observable<boolean>(false);

            this.displayValue = ko.pureComputed({
                read: () => {
                    
                    let result: any = this.value() !== undefined ? this.showRelative() ? Util.round((this.value() / getAbsolute() * 100)) + '%' 
                        : Math.round(this.value()) + 'px' : undefined;
                    
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

            this.setData = (data: any) => {
                if(data) {
                    data = <IDimensionData>data;
                    this.showRelative(data.showRelative);
                    this.isAbsolute(data.isAbsolute);
                }
            };

            this.getData = ko.computed(() => {
                return <IDimensionData>{
                    value: this.value(),
                    showRelative: this.showRelative(),
                    isAbsolute: this.isAbsolute()
                }
            }); 
        }
    }
}