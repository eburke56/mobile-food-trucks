const _ = require('lodash');
const { ApolloServer, gql } = require('apollo-server');
const { ApolloError } = require('apollo-server-express');
const DistanceAPI = require('./service');
const trucks = require('./trucks');

const allValidDestinations = _.chain(trucks)
  .filter(
    ({ latitude, longitude }) =>
      latitude > 30 && latitude < 40 && longitude > -125 && longitude < -115
  )
  .map(({ applicant, address, latitude, longitude }) => ({
    name: applicant,
    address,
    latitude,
    longitude,
  }))
  .valueOf();

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
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

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    findTrucks: async (
      parent,
      { latitude, longitude, travelMode = 'driving', limit = 5 },
      { dataSources }
    ) => {
      switch (travelMode) {
        case 'driving':
        case 'walking':
          break;

        default:
          throw new ApolloError('travelMode must be driving or walking');
      }

      if (limit <= 0) {
        throw new ApolloError('limit must be >= 0');
      }

      const origins = [
        {
          latitude,
          longitude,
        },
      ];

      // here, we filter out any locations whose data is not valid, e.g., lat/lng = 0
      const destinations = allValidDestinations;
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
              .map(({ destinationIndex, travelDistance, travelDuration }) => {
                const {
                  name,
                  address,
                  latitude,
                  longitude,
                } = allValidDestinations[destinationIndex];

                return {
                  name,
                  address,
                  latitude,
                  longitude,
                  travelDistance,
                  travelDuration,
                };
              })
              .take(limit)
              .valueOf();

            return orderedResults;
          }
        }
      } catch (e) {
        error = new ApolloError(e);
      }

      throw error || new ApolloError('Unknown error');
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
  playground: {
    settings: {
      'general.betaUpdates': false,

      // possible values: 'line', 'block', 'underline'
      'editor.cursorShape': 'line',
      'editor.fontSize': 14,
      'editor.fontFamily':
        "'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace",

      // possible values: 'dark', 'light'
      'editor.theme': 'light',

      // new tab reuses headers from last tab
      'editor.reuseHeaders': true,
      'prettier.printWidth': 80,

      // Used for sending credentials when making requests;
      // see https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
      'request.credentials': 'same-origin',

      // if true, removes the "tracing" object from the GraphQL response
      // which contains information about timing, etc.
      'tracing.hideTracingResponse': false,
    },
    tabs: [
      {
        endpoint: '/',
        name: 'Find Food Trucks',
        query: `query FindTrucks(
  $latitude: Float!
  $longitude: Float!
  $travelMode: String
  $limit: Int
) {
  findTrucks(
    latitude: $latitude
    longitude: $longitude
    travelMode: $travelMode
    limit: $limit
  ) {
    name
    address
    travelDistance
    travelDuration
  }
}`,
        variables: JSON.stringify(
          {
            latitude: 37.77646,
            longitude: -122.41645,
            travelMode: 'driving',
            limit: 5,
          },
          null,
          2
        ),
      },
    ],
  },
});

server.listen().then(({ url }) => {
  console.log(`�  Server ready at ${url}`);
});
