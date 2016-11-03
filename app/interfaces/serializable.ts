module mapp.le {
    export interface ISerializable {
        serialize(...params: any[]): any;
        deserialize(data: any)
    }
}