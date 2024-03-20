import { prismaClient } from '../lib/db';
import { createHmac, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "mobanda7inches";

export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface GetUserTokenPayload {
    email: string;
    password: string;
}

export class UserService {

    private static generateHash(salt: string, password: string) {
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
        return hashedPassword;
    }
    public static getUserById(id: string) {
        return prismaClient.user.findUnique({where:{id}})
    }

    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString('hex'); // Use 'hex' encoding
        const hashedPassword = UserService.generateHash(salt, password);
        try {
            const user = await prismaClient.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    salt,
                    password: hashedPassword,
                }
            });
            return user;
        } catch (error) {
            throw new Error("Could not create user");
        }
    }

    private static async getUserByEmail(email: string) {
        return await prismaClient.user.findUnique({ where: { email } });
    }

    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email);

        if (!user) throw new Error('User not found');

        const userSalt = user.salt;
        const userHashedPassword = UserService.generateHash(userSalt, password);

        if (userHashedPassword !== user.password) {
            throw new Error('Incorrect password');
        }

        // Generate a JWT Token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        return token; // Return the token
    }

    public static decodeJWTToken(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}


