module mapp.le {

    export class Attribute<T> {

        protected value: KnockoutObservable<T>;
        protected displayValue: KnockoutComputed<string>;
        protected label: string;
        protected template: string;

        constructor(value: T | KnockoutObservable<T>, label: string, template: enums.AttributeTemplates) {
            this.value = ko.isObservable(value) ? <KnockoutObservable<T>>value : ko.observable(value);
            this.label = label;
            this.template = Util.getTemplate(template);

            this.displayValue = ko.computed({
                read: () => {
                    return this.value() ? this.value().toString() : '';
                },
                write: (value: any) => {
                    this.value(value);
                }
            })
        }

        getValue(): T {
            return this.value();
        }
    }

    export class NumberAttribute extends Attribute<number> {

        constructor(value: number | KnockoutObservable<number>, label: string) {

            super(value, label, enums.AttributeTemplates.INPUT_NUMERIC);
            this.displayValue = ko.computed({
                read: () => {
                    return this.value().toString();
                },
                write: (value: any) => {
                    //string to number
                    this.value(value);
                }
            })
        }
    }
}