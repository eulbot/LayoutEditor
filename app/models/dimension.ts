module mapp.le {

    export class Dimension implements ISerializable {
        public value: KnockoutObservable<number>;
        public showRelative: KnockoutObservable<boolean>;
        public isLocked: KnockoutObservable<boolean>;

        public displayValue: KnockoutComputed<number>;
        public unit: KnockoutComputed<string>;
        public isComputed: KnockoutComputed<boolean>;
        public getProperties: KnockoutComputed<IDimensionProperties>;
        public setProperties: (data: any) => any;

        constructor(getAbsolute: () => number) {
            
            this.value = ko.observable<number>();
            this.isLocked = ko.observable<boolean>(false);
            this.showRelative = ko.observable<boolean>(false);
            this.displayValue = ko.pureComputed({
                read: () => {
                    
                    let result: any = this.value() !== undefined ? this.showRelative() ? Util.round((this.value() / getAbsolute() * 100))  
                        : Math.round(this.value()) : undefined;
                    
                    if(this.showRelative())
                        this.isLocked(false);

                    return result;
                },
                write: (value: string) => {

                    if(value) {
                        this.showRelative(value.indexOf('%') >= 0 || (value.indexOf('px') < 0 && this.showRelative()) ? true : false);
                        let parsed = parseFloat(value.replace(/[^\.\d]/g, ""));
                        parsed = isNaN(parsed) ? this.value() : parsed;
                        if(parsed > 10000) parsed = 9999;
                        let result: number = this.showRelative() ? getAbsolute() * parsed / 100: parsed;
                        this.value(result);
                    }
                }
            });

            this.unit = ko.pureComputed(() => {
                 if(this.showRelative())
                    return '%';
                
                return 'px';
            });

            this.setProperties = (data: any) => {
                if(data) {
                    data = <IDimensionProperties>data;
                    this.showRelative(data.showRelative);
                    this.isLocked(data.isLocked);
                }
            };

            this.getProperties = ko.computed(() => {
                return <IDimensionProperties>{
                    value: this.value(),
                    showRelative: this.showRelative(),
                    isLocked: this.isLocked()
                }
            }); 
        }

        serialize = () => {
            return {
                value: this.value(),
                showRelative: this.showRelative(),
                isLocked: this.isLocked                
            }
        }
    }
}