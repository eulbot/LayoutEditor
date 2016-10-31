module mapp.le {
    export interface ITemplate {
        displayText: string;
        icon: string;
        addElement: () => EditorObject;
    }
}