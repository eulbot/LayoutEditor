module mapp.le {
    export interface IEditorObjectData {
        type: enums.ElementType,
        id: number,
        name: string,
        object: string,
        width: IDimensionData,
        height: IDimensionData,
        top: IDimensionData, 
        right: IDimensionData, 
        bottom: IDimensionData, 
        left: IDimensionData
    }
}