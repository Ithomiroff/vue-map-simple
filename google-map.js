const REGISTER_CARD = (map) => {
  window.map = map;
  window.service = new google.maps.places.AutocompleteService();
  window.geocoder = new google.maps.places.PlacesService(map);
};

const FIND_PLACE = (input) => {
  const request = {
    input,
  };
  return new Promise((res, rej) => {
    service.getQueryPredictions(request, (results, status) => {
      res(results);
    });
  })
};

const GET_COORDINATES = (placeId) => {
  const request = {
    placeId,
    fields: ['geometry']
  };
  return new Promise((res, rej) => {
    geocoder.getDetails(request, (result) => {
      const position = result && result.geometry && result.geometry.location;
      if (position) {
        res(position)
      }
    })
  })
};

