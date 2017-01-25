app.factory('ssSearchFactory', function() {
  var getSongs = function(q) {
    return SC.get('/tracks', { q: q });
  };
  return {
    getSongs: getSongs
  };
});
