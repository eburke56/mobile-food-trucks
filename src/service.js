const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('./config');

class DistanceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://dev.virtualearth.net/REST/';
  }

  async getDistanceMatrix({ origins, destinations, travelMode }) {
    const body = {
      origins,
      destinations,
      travelMode,
    };
    const request = this.post(
      `v1/Routes/DistanceMatrix?key=${config.key}`,
      body
    );

    // TODO: support timeout
    return request;
  }
}

class TruckAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://data.sfgov.org/resource/';
  }

  async getFoodTruckData() {
    const request = this.get(`rqzj-sfat.json`);

    // TODO: support timeout
    return request;
  }
}

module.exports = {
  DistanceAPI,
  TruckAPI,
};
