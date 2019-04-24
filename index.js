const _ = require('lodash');
const { ApolloServer, gql } = require('apollo-server');
const { ApolloError } = require('apollo-server-express');
const DistanceAPI = require('./service');
const trucks = require('./trucks');

const filteredTrucks = _.map(
  trucks,
  ({ applicant, address, latitude, longitude, dayshours }) => ({
    name: applicant,
    address,
    latitude,
    longitude,
    dayshours,
  })
);

const allDestinations = _.map(filteredTrucks, ({ latitude, longitude }) => ({
  latitude,
  longitude,
}));

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.
  type Availability {
    day: String!
    open: String!
    close: String!
  }

  # This "Book" type can be used in other type declarations.
  type FoodTruck {
    name: String!
    address: String!
    latitude: Float!
    longitude: Float!
    availability: [Availability!]
    isOpenNow: Boolean!
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    findTrucks(
      latitude: Float!
      longitude: Float!
      travelMode: String!
    ): [FoodTruck!]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    findTrucks: async (
      parent,
      { latitude, longitude, travelMode },
      { dataSources }
    ) => {
      const origins = [
        {
          latitude,
          longitude,
        },
      ];

      // here, we filter out any locations whose data is not valid, e.g., lat/lng = 0
      const destinations = _.take(allDestinations, 4);
      let error;

      try {
        const response = await dataSources.distanceAPI.getDistanceMatrix({
          origins,
          destinations,
          travelMode,
        });

        const { statusCode, statusDescription } = response;

        // If we did not get a valid response, throw an error.
        // Otherwise, we grab the data from the response and order by travel time.
        // Return 5 trucks for now.
        // TODO: allow caller to pass in how many trucks they want
        // TODO: support pagination
        if (!statusCode || statusCode !== 200) {
          error = new ApolloError(
            statusDescription || 'Unknown error',
            statusCode || 0
          );
        } else {
          const results = _.get(
            response,
            'resourceSets[0].resources[0].results'
          );
          if (!results) {
            error = new ApolloError('No results available');
          } else {
            const orderedResults = _.chain(results)
              .sortBy('travelDuration')
              .take(5)
              .valueOf();

            return orderedResults;
          }
        }
      } catch (e) {
        error = new ApolloError(e);
      }

      throw error || new ApolloError("Unknown error");
    },
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    distanceAPI: new DistanceAPI(),
  }),
  engine: process.env.ENGINE_API_KEY && {
    apiKey: process.env.ENGINE_API_KEY,
  },
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
