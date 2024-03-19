import express from 'express'
import createApolloGraphqlServer from './graphql';
import { expressMiddleware } from '@apollo/server/express4';





async function init() {
    const app = express()
    const PORT = Number(process.env.PORT) || 8000;


    app.use(express.json());
    //Create GraphQl Server

    app.get("/", (req, res) => {
        res.json({ Message: "Server is Up and Running" });

    })

    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer()));

    app.listen(PORT, () => console.log(` Server is running at PORT: ${PORT}`))
}

init();