module mapp.le {
    export interface IDimensionData {
        value: number,
        data: {
            showRelative: boolean,
            isAbsolute: boolean
        }
    }
}