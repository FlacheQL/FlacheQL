//import jquery
//import other dependencies (if any?)

// declare variables based on jquery selector 
const resolvers = {
  // context parameter in query parameter holds important contextual info like currently logged in user or access to db
  Query: {
    info: () => console.log('this is a test!'),
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
    
    },
}