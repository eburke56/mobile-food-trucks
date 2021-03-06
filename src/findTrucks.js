const _ = require('lodash');
const { ApolloError } = require('apollo-server-express');

// a valid destination is one whose lat/lng is inside a bounding
// box that includes San Francisco
const allValidDestinations = async dataSources => {
  const trucks = await dataSources.truckAPI.getFoodTruckData();

  return _.chain(trucks)
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
};

module.exports = {
  /**
   * Find all food trucks given the paramters
   * @param parent
   * @param latitude The latitude of the caller
   * @param longitude The longitude of the caller
   * @param travelMode "driving" or "walking"
   * @param limit Number of results to return, must be >= 0
   * @param dataSources All data sources available for query
   * @returns {Promise<[FoodTruck!]>}
   */
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

    const destinations = await allValidDestinations(dataSources);
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
      // TODO: support pagination
      if (!statusCode || statusCode !== 200) {
        error = new ApolloError(
          statusDescription || 'Unknown error',
          statusCode || 0
        );
      } else {
        const results = _.get(response, 'resourceSets[0].resources[0].results');
        if (!results) {
          error = new ApolloError('No results available');
        } else {
          return _.chain(results)
            .sortBy('travelDuration')
            .map(({ destinationIndex, travelDistance, travelDuration }) => {
              const {
                name,
                address,
                latitude,
                longitude,
              } = destinations[destinationIndex];

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
        }
      }
    } catch (e) {
      error = new ApolloError(e);
    }

    throw error || new ApolloError('Unknown error');
  },
};
