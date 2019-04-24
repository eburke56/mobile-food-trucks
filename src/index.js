const { ApolloServer, gql } = require('apollo-server');
const { ApolloError } = require('apollo-server-express');
const { DistanceAPI, TruckAPI } = require('./service');
const playground = require('./playground');
const { findTrucks } = require('./findTrucks');

// These are the schema defined in the system
const typeDefs = gql`
  # FoodTruck defines a single truck entity
  type FoodTruck {
    name: String!
    address: String!
    latitude: Float!
    longitude: Float!
    travelDistance: Float!
    travelDuration: Float!
  }

  type Query {
    # find the trucks nearest the given location
    findTrucks(
      latitude: Float!
      longitude: Float!
      travelMode: String
      limit: Int
    ): [FoodTruck!]
  }
`;

// Resolvers for any supported queries
const resolvers = {
  Query: {
    findTrucks,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    distanceAPI: new DistanceAPI(),
    truckAPI: new TruckAPI(),
  }),
  engine: process.env.ENGINE_API_KEY && {
    apiKey: process.env.ENGINE_API_KEY,
  },
  playground,
});

server.listen().then(({ url }) => {
  console.log(`�  Server ready at ${url}`);
});
