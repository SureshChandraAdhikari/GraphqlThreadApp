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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const user_1 = require("../../services/user");
const queries = {
    getUserToken: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = yield user_1.UserService.getUserToken({
                email: payload.email,
                password: payload.password,
            });
            return token;
        }
        catch (error) {
            console.error("Error retrieving user token:", error);
            throw new Error("Could not retrieve user token");
        }
    }),
    getCurrentLoggedInUser: (_, parameters, context) => __awaiter(void 0, void 0, void 0, function* () {
        if (context && context.user) {
            const id = context.user.id;
            const user = yield user_1.UserService.getUserById(id);
            return user;
        }
    })
};
const mutations = {
    createUser: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield user_1.UserService.createUser(payload);
            return res.id;
        }
        catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Could not create user");
        }
    })
};
exports.resolvers = {
    queries,
    mutations
};
