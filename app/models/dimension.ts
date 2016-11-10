module mapp.le {

    export class Dimension implements ISerializable<IDimensionData> {
        private _value: Value;
        private getAbsolute: KnockoutObservable<number>;
        public isLocked: KnockoutObservable<boolean>;
        public isCompound: KnockoutComputed<boolean>;
        public value: KnockoutComputed<number>;
        public displayValue: KnockoutComputed<number>;
        public unit: KnockoutComputed<string>;

        constructor(getAbsolute: KnockoutObservable<number>) {
            
            this._value = new Value();
            this.getAbsolute = getAbsolute;
            this.isLocked = ko.observable<boolean>(false);

            this.value = ko.computed({
                read: () => {
                    return this._value.abs() + (this._value.rel() != 0 ? this._value.rel() * this.getAbsolute() : 0);
                },
                write: (value: number) => {
                    this._value.rel(0);
                    this._value.abs(value);
                }
            });

            this.displayValue = ko.computed({
                read: () => {
                    
                    let result: any;

                    // Value is compund (i.e. 20% + 30px)
                    if(this._value.abs() != 0 && this._value.rel() != 0) 
                        result = Util.round(this._value.rel() * 100) + '% + ' + Math.round(this._value.abs()) + 'px';
                    // Value is relative
                    else if(this._value.rel() != 0)
                        result = Util.round(this._value.rel() * 100);
                    // Value is absolute
                    else if(this._value.abs() != undefined)
                        result = Math.round(this._value.abs());
                    
                    if(this._value.rel() != 0)
                        this.isLocked(false);

                    return result;
                },
                write: (value: string) => {

                    if(value) {
                        let isRelative = value.indexOf('%') >= 0 || (value.indexOf('px') < 0 && this._value.rel() != 0) ? true : false;
                        let parsed = parseFloat(value.replace(/[^\.\d]/g, ""));
                        parsed = isNaN(parsed) ? this.value() : parsed;

                        if(!isNaN(parsed)) {
                            if(parsed > 10000) parsed = 9999;
                            if(isRelative) {
                                this._value.abs(0);
                                this._value.rel(parsed / 100)
                            }
                            else {
                                this._value.abs(parsed);
                                this._value.rel(0);
                            }
                        }

                        var x = 1;
                    }
                }
            });

            this.isCompound = ko.pureComputed(() => {
                return this._value.abs() != 0 && this._value.rel() != 0
            });

            this.unit = ko.pureComputed(() => {
                if(this._value.abs() == 0 && this._value.rel() != 0)
                    return '%';

                return 'px';
            });
        }

        public getValue() {
            return this._value;
        }

        public solve() {
            this.value(this._value.abs() + this._value.rel() * this.getAbsolute());
        }

        serialize = (): IDimensionData => {
            return {
                value: this._value.serialize(),
                isLocked: this.isLocked()                
            }
        }

        deserialize = (dimensionData: IDimensionData) => {
            this._value.deserialize(dimensionData.value);
            this.isLocked(dimensionData.isLocked);
        }
    }
}