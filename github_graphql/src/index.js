const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
import express from 'express';
import bodyParser from 'b'


const app = express();

const typeDefs = `
  type Query {
    info: String!
    repository(owner: String!, name: String!): 
      Repository {
        createdAt
        issues(last: Int, states: String!) {
          edges {
            node {
              title
              url
            }
          }
        }
      }
  } `


  /*type Query {
      
  }
*/
  const resolvers = {
    info: () => 'this is a test of the github graphql api',
    repository: (root, args, context, info) => {
      return context.
    }
    

  }

  const server = new GraphQLServer({
      typeDefs: './src/schema.graphql',
      resolvers,
      context: req => ({
          ...req,
          db: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'https://api.github.com/graphql',
            token: '5941a911a1abcbd19ca0f71ecf22b91adfa285ba',
            debug: true
          }),
      }),
  })