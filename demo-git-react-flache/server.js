const app = require('express')();
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');

app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}))

app.listen(4001, () => console.log('Listening on 4001...'));