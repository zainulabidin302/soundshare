'use strict';
app.service('ssSessionService', function(apiURL, socketService, $http, $q, $rootScope) {

    var defer;
    function get(_id) {
        return $http.get(apiURL + '/session/' + _id);
    }

    function update(data) {
        defer = $q.defer();
        socketService.send('update', data);
        return defer.promise;
    }

    function saveSessionLocally(data) {
      $rootScope.sessions = $rootScope.sessions || [];
      $rootScope.sessions.push(data)
    }
    function getLocalSession(session_id) {
      if ($rootScope.sessions) {
        var list =  _.filter($rootScope.sessions, _.matches({session_id: session_id}));
        return list.length > 0 ? list[0] : null;
      }

      return null;
    }
    socketService.when('updated', function(data) {
        defer.resolve(data);
    });
    socketService.when('error', function(data) {
        defer.reject(data);
    });





    function create(url) {
        return $http.post(apiURL +'/session/create', {
            url: url
        });
    }


    return {
        create: create,
        update: update,
        get: get,
        getLocalSession: getLocalSession,
        saveSessionLocally: saveSessionLocally
    }
});
