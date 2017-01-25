'use strict';
app.directive('ssPlayerDrct', function( ssSessionService, $location, $timeout, $interval, $routeParams) {
    return {
        restrict: 'EA',
        templateUrl: 'src/player/player.html',
        replace: true,
        scope: {
            streamUrl: '=',
            session: '@',
            updates: '=',
            catch  : '='
        },
        link: function(scope, element, attr) {


          var interval_id = null;

          var frequency   = 0.5 /* seconds */ * 1000 /* milli */;
          var el = angular.element(element)
            .find('#main-audio-player').get(0);
          scope.$watch('catch', function(newVal, oldVal) {
            if (newVal != null)
              el.currentTime = newVal
          })
          el.addEventListener('play', function(evt) {
            interval_id = $interval(function() {
              ssSessionService.update({
                time: el.currentTime,
                session_id: scope.session,
                session_node_id: ssSessionService.getLocalSession(scope.session) !== null ? ssSessionService.getLocalSession(scope.session).session_node_id : null
              }).then(function(data) {
                scope.updates = data;
              })
            }, frequency);
          }, false);

          el.addEventListener('pause', function(evt) {
          $interval.cancel(interval_id);
          }, false);

        }
    }
});
