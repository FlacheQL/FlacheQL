const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const express = require('express');
const bodyParser = require('body-parser');
const githubSchema = require('../schema/schema.graphql');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const PORT = 4000;
const app = express();
//was having trouble doing this in a modular fashion...how to import and all that from another file?
const schema = buildSchema( `
type Query {
  info: String!
  repository(owner: String!, name: String!): Repository
  search(query: String!, type: String!): SearchResultItemConnection

}

type Repository {
  collaborators(first: Int!): RepositoryCollaboratorConnection
  #createdAt: DateTime!
  #updatedAt: DateTime!
  databaseId: Int
  description: String
  name: String!
  stargazers: StargazerConnection!
}

type StargazerConnection {
  totalCount: Int!
}

type RepositoryCollaboratorConnection {
  nodes: [User]
}

type User {
  id: ID!
  name: String!
  repositories(first: Int): RepositoryConnection
}

type RepositoryConnection {
  totalCount: Int!
  nodes: [Repository]
}

#type SearchType {
   #repository: REPOSITORY
   #user: USER
   #}

type SearchResultItemConnection {
  repositoryCount: Int!
  userCount: Int!
}
`
);


/*
endpoint: 'https://api.github.com/graphql',
token: '5941a911a1abcbd19ca0f71ecf22b91adfa285ba'
*/


// change to express 
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema, graphiql: true }));
// app.get('/', bodyParser.json(), graphqlExpress({ schema: schema, graphiql: true }));
// app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphiql' }));

app.listen(PORT, () => {console.log('listening on port ', PORT)});