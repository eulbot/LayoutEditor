module mapp.le {
    export interface ISerializable<T> {
        serialize(...params: any[]): T;
        deserialize(data: any)
    }
}