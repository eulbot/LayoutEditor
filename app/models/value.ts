

module mapp.le {

    export class Value implements ISerializable<IValueData> {
        public abs: KnockoutObservable<number>;
        public rel: KnockoutObservable<number>;

        constructor() {
            this.abs = ko.observable<number>(0);
            this.rel = ko.observable<number>(0);
        }

        serialize = (): IValueData => {
            return {
                abs: this.abs(),
                rel: this.rel()                
            }
        }

        deserialize = (valueData: IValueData) => {
            this.abs(valueData.abs);
            this.rel(valueData.rel);
        }
    }
}