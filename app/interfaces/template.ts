module mapp.le {
    export interface ITemplate {
        displayText: string;
        addElement: () => EditorObject;
    }
}