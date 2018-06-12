const app = require('express')();
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');
const express = require('express');
const path = require('path')

app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}))

app.use(express.static(path.join(__dirname + '/src')))

app.listen(4001, () => console.log('Listening on 4001...'));