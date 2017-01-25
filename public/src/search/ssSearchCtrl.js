'use strict';
app.controller('ssSearchCtrl', function($scope, ssSearchFactory, ssSessionService, $location) {
    $scope.q = '';
    $scope.loading = false;
    $scope.results = [];
    $scope.stream_url = '';


    $scope.play = function(url) {
        $scope.stream_url = url;
    }

    $scope.getResults = function(q) {
        $scope.loading = true;
        ssSearchFactory.getSongs(q).then(function(tracks) {
            $scope.$apply(function() {
                console.log(tracks)
                $scope.results = tracks;
                $scope.loading = false;
            }).then(null, function(err) {
                console.log(err);
                $scope.loading = false;
            })
        })
    };
    $scope.createSession = function(url) {
        ssSessionService.create(url).then(function(res) {
          console.log(res);
            if (res.data._id) {
                $location.path('/session/' + res.data._id);
            }
            ssSessionService.saveSessionLocally({
              session_id: res.data._id,
              session_node_id: res.data.session_node_id
            });
        }).then(null, function(err) {
            console.log(err);
        });
    }
});
