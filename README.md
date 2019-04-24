# Mobile Food Trucks, GraphQL style

Now you can find your food, your way!

## Getting Started

1. Make sure you have `node.js` and `npm` installed. Follow the instructions here: https://www.npmjs.com/get-npm
1. Clone this repository. `git clone git@github.com:eburke56/mobile-food-trucks.git`
1. In the toplevel directory of your clone, run `npm install`
1. To start the server, run `npm start`
1. ~~Profit!~~ Eat!

## Getting your results

1. Using a web browser
   * Navigate to http://localhost:4000
   * In the Playground, you will see a tab called "Find Food Trucks". This will allow you to run your query.
   <image>
   * Modify your latitude and longitude appropriately.
   * Hit the big arrow button to find your food!
1. Using the command line: execute the following `cURL`, substituting your latitude, longitude, preferred travelMode, and limit into the `variables` payload
```bash
curl -X POST \
  -H 'Accept-Encoding: gzip, deflate, br' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Connection: keep-alive' \
  -H 'DNT: 1' \
  -H 'Origin: http://localhost:4000' \
  --compressed \
  --data-binary '{"query":"query FindTrucks(\n  $latitude: Float!\n  $longitude: Float!\n  $travelMode: String\n  $limit: Int\n) {\n  findTrucks(\n    latitude: $latitude\n    longitude: $longitude\n    travelMode: $travelMode\n    limit: $limit\n  ) {\n    name\n    address\n    travelDistance\n    travelDuration\n  }\n}","variables":{"latitude":37.77646,"longitude":-122.41645,"travelMode":"driving","limit":5}}' \
  'http://localhost:4000/'
```  

## Future features

1. Cache food truck data in another process to avoid performance issues and too many downstream requests.
1. Parse out the `dayshours` and only return those trucks that are open at the current time (or allow the caller to choose)
1. Add a link to driving/walking directions for easy click-and-go. 

## Considerations for Production Readiness and Deployment

1. Add unit tests using `jest`. As part of this, mock out the fetching of truck data.
1. Configure CI and connect to gihub so that merging is disabled pending all CI and other checks.
1. Spin up app configuration and deployment scripts so that the same codebase can be deployed anywhere with no code changes.
1. Connect to Apollo Engine (https://engine.apollographql.com/) for detailed metrics on the running system.
1. Connect app to monitoring services (e.g., DataDog, PagerDuty, etc.)

## Documentation

Check out the [official Apollo Server documentation](https://www.apollographql.com/docs/apollo-server/v2/) for more information.
