import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';





async function  init() {
    const app = express()
const PORT = Number(process.env.PORT) || 8000;


app.use(express.json());
//Create GraphQl Server
const gqlServer = new ApolloServer({
    typeDefs:`
    type Query {
        hello:String
        say(name: String): String
    }`,
    resolvers: {
        Query:{
            hello: () => `Hey there I am a GraphQL Server`,
            say:(_,{name}:{name:string}) => `Hey ${name}, How are You`
        }
    }
})

//Start the GQL Server

await gqlServer.start()
app.get("/" , (req,res) => {
    res.json({ Message : "Server is Up and Running"});

})

app.use('/graphql',expressMiddleware(gqlServer));

app.listen(PORT , () => console.log(` Server is running at PORT: ${PORT}`))
}

init();