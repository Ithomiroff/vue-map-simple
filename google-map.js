const REGISTER_CARD = (map) => {
  window.map = map;
  window.service = new google.maps.places.AutocompleteService();
};

const FIND_PLACE = (input) => {
  const request = {
    input,
  };
  return new Promise((res, rej) => {
    service.getQueryPredictions(request, function(results, status) {
      res(results);
    });
  })
};
