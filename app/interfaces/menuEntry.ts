module mapp.le {
    export interface IMenuEntry {
        isToggled: KnockoutObservable<boolean>;
        css: KnockoutComputed<string>;
    }
}