module.exports = {
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
};
