import { User } from './index';
export const queries = `#graphql
getUserToken(email:String! , password: String!):String
getCurrentLoggedInUser: User
`