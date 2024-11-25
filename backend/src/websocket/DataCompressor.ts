// backend/src/websocket/DataCompressor.ts
import { inflate, deflate } from 'pako';

export class DataCompressor {
    static compress(data: any): Uint8Array {
        const jsonString = JSON.stringify(data);
        return deflate(jsonString);
    }

    static decompress(data: Uint8Array): any {
        const jsonString = inflate(data, { to: 'string' });
        return JSON.parse(jsonString);
    }
}