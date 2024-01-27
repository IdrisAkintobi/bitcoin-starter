import argon2 from 'argon2';
import { Buffer } from 'buffer';
import { randomBytes } from 'node:crypto';
import { DB } from '../db/db';
import { UserInterface } from '../types/interface';

export class User {
    constructor() {}

    public static async create({ username, password }: UserInterface): Promise<UserInterface> {
        // check if user exists
        const users = await DB.read();
        const user = users.find(user => user.username === username);

        if (user) {
            throw new Error('User already exists');
        }

        // create user
        const seed = randomBytes(32);
        const hash = await argon2.hash(password);
        const seedHex = Buffer.from(seed).toString('hex');

        await DB.append([{ username, password: hash, seed: seedHex }]);

        return { username, password: hash, seed: seedHex } as UserInterface;
    }

    public static async login({ username, password }: UserInterface): Promise<UserInterface> {
        const users = await DB.read();
        const user = users.find(user => user.username === username);

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordCorrect = await argon2.verify(user.password, password);

        if (!isPasswordCorrect) {
            throw new Error('Password is incorrect');
        }

        return user as UserInterface;
    }
}
