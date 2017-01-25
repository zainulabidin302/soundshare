'use strict';
app.controller('ssSessionCtrl', function($scope, $routeParams, ssSessionService,ssShareService, ssTrustSSURLFilter) {
    $scope.data = {
        email: 'zainulabidin302@gmail.com'
    };
    $scope.updates = ''; // catch updates from other users
    $scope.catch   = null;
    if ($routeParams.id) {
        ssSessionService.get($routeParams.id).then(function(session) {
            console.log(session)
            session = session.data;
            console.log(session)
            $scope.stream_url = ssTrustSSURLFilter(session.url);
            $scope.session = session._id;
            ssSessionService.saveSessionLocally({
            session_id: session._id,
            session_node_id: session.session_node_id,
          });
        }).then(null, function(err) {
            console.log(err);
        });
    } else {
        $location.path('/home');
    }

    $scope.shareWithEmail = function (email) {
      ssShareService.shareWithEmail({
        email: email,
        session_id: $routeParams.id
      }).then(function(data) {
        console.log('DONE !');
      }).then(null, function(err) {
        console.log('Err', err);
      });
    }

    $scope.catchSession = function(data) {
      console.log(data)
      $scope.catch = data.length > 0 ?  data[data.length-1] + 0.5 : null;
    }

    $scope.getFirst = function(data) {
      return data.length > 0 ?  data[data.length-1] : null;
    }

});
