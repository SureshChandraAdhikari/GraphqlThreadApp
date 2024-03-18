import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from "./lib/db"




async function init() {
    const app = express()
    const PORT = Number(process.env.PORT) || 8000;


    app.use(express.json());
    //Create GraphQl Server
    const gqlServer = new ApolloServer({
        typeDefs: `
    type Query {
        hello:String
        say(name: String): String
    }
    type Mutation{
        createUser(firstName:String! , lastName: String! , password: String! , email:String!): Boolean
    }
    `,
        resolvers: {
            Query: {
                hello: () => `Hey there I am a GraphQL Server`,
                say: (_, { name }: { name: string }) => `Hey ${name}, How are You`
            },
            Mutation: {
                createUser: async (_,
                    { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
                        await prismaClient.user.create({
                            data: {
                                email,
                                firstName,
                                lastName,
                                password,
                                salt: 'random_salt'
                            },
                        })
                    return true;
                }
            }
        }
    })

    //Start the GQL Server

    await gqlServer.start()
    app.get("/", (req, res) => {
        res.json({ Message: "Server is Up and Running" });

    })

    app.use('/graphql', expressMiddleware(gqlServer));

    app.listen(PORT, () => console.log(` Server is running at PORT: ${PORT}`))
}

init();