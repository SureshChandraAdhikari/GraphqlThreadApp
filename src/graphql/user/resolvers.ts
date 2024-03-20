import { UserService, CreateUserPayload } from "../../services/user";

const queries = {
    getUserToken: async (_: any, payload: { email: string, password: string }) => {
        try {
            const token = await UserService.getUserToken({
                email: payload.email,
                password: payload.password,
            });
            return token;
        } catch (error) {
            console.error("Error retrieving user token:", error);
            throw new Error("Could not retrieve user token");
        }
    },
getCurrentLoggedInUser : async(_:any ,parameters:any , context:any) => {
    if(context&& context.user){
        const id = context.user.id;
        const user = await UserService.getUserById(id)
        return user;
    }
    
}
};

const mutations = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        try {
            const res = await UserService.createUser(payload);
            return res.id;
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Could not create user");
        }
    }
};

export const resolvers = {
    queries,
    mutations
};
