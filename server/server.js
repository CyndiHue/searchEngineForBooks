const express = require('express');
const {ApolloServer} = require ('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const db = require('./config/connection');
// must delete after and queries and mutations setup 
const { authMiddleware } = require('./utils/auth');
const app = express();
const { typeDefs, resolvers } = require('./schemas');
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Uncomment the following code once you have built the queries and mutations in the client folder
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));
  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Uncomment this code once you have built out queries and mutations in the client folder
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } // closes if (process.env.NODE_ENV === 'production') condition

// Uncomment this code once you have built out queries and mutations in the client folder
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Uncomment the following code once you have built the queries and mutations in the client folder
startApolloServer();

