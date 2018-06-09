//import jquery
//import other dependencies (if any?)

// declare variables based on jquery selector 

query {
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
}