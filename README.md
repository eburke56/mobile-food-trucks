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

## Future features

1. Fetch truck data regularly, or even in real-time.
1. Parse out the `dayshours` and only return those trucks that are open at the current time (or allow the caller to choose)
1. Add a link to driving/walking directions for easy click-and-go. 

## Documentation

Check out the [official Apollo Server documentation](https://www.apollographql.com/docs/apollo-server/v2/) for more information.
