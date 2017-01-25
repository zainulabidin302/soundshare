'use strict';
app.directive('ssSearchDrct', function() {
    return {
        restrict: 'EA',
        templateUrl: 'src/search/search.html',
        controller: 'ssSearchCtrl',
        controllerAs: 'vm',
        transclude: true
    }
});
