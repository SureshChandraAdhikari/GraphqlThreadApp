import express from 'express'
import createApolloGraphqlServer from './graphql';
import { expressMiddleware } from '@apollo/server/express4';
import { UserService } from './services/user';





async function init() {
    const app = express()
    const PORT = Number(process.env.PORT) || 8000;


    app.use(express.json());
    //Create GraphQl Server

    app.get("/", (req, res) => {
        res.json({ Message: "Server is Up and Running" });

    })

    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer() , {context: async({req}) =>{
        const token = req.headers['token']
        try {
            const user = UserService.decodeJWTToken(token as string);
            return {user}
        } catch (error) {
            return {};
        }
    }}));

    app.listen(PORT, () => console.log(` Server is running at PORT: ${PORT}`))
}

init();