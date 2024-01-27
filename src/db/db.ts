import { readFile, writeFile } from 'node:fs';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const DB_PATH = resolve(__dirname, '..', '../db.json');

const read = promisify(readFile);
const write = promisify(writeFile);

export class DB {
    public static async read(): Promise<Array<Record<string, any>>> {
        try {
            const data = await read(DB_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            console.log(
                'Error reading the database file: Create a new one db.json with an empty array as content',
            );
            throw e;
        }
    }

    public static async append(data: Array<Record<string, any>>): Promise<void> {
        const existingData = await this.read();
        const newData = [...existingData, ...data];
        await write(DB_PATH, JSON.stringify(newData));
    }
}
