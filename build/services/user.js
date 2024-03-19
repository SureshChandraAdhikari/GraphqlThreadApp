"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../lib/db");
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Change import to use the default export of 'jsonwebtoken'
const JWT_SECRET = "mobanda7inches";
class UserService {
    static generateHash(salt, password) {
        const hashedPassword = (0, crypto_1.createHmac)('sha256', salt).update(password).digest('hex');
        return hashedPassword;
    }
    static createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = payload;
            const salt = (0, crypto_1.randomBytes)(32).toString('hex'); // Use 'hex' encoding
            const hashedPassword = UserService.generateHash(salt, password);
            try {
                const user = yield db_1.prismaClient.user.create({
                    data: {
                        firstName,
                        lastName,
                        email,
                        salt,
                        password: hashedPassword,
                    }
                });
                return user;
            }
            catch (error) {
                throw new Error("Could not create user");
            }
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prismaClient.user.findUnique({ where: { email } }); // Add 'await' here
        });
    }
    static getUserToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const user = yield UserService.getUserByEmail(email);
            if (!user)
                throw new Error('User not found');
            const userSalt = user.salt;
            const userHashedPassword = UserService.generateHash(userSalt, password);
            if (userHashedPassword !== user.password) {
                throw new Error('Incorrect password');
            }
            // Generate a JWT Token
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET);
            return token; // Return the token
        });
    }
}
exports.UserService = UserService;
