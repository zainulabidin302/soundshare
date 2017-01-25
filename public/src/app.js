var app = angular.module('soundShare', ['ngRoute']);
app.constant('baseURL', 'localhost:4201')
app.constant('apiURL', 'http://localhost:4201/api')
app.constant('clientId', '32e7cc213850783795d8fbba90ee55c6')
app.config(function($routeProvider, $httpProvider) {
  $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
    $routeProvider.when('/home', {
        controller: 'ssHomeCtrl',
        templateUrl: 'src/home/home.html'
    }).when('/session/:id', {
      controller: 'ssSessionCtrl',
      templateUrl: 'src/session/session.html'
    }).otherwise('/', {
        controller: 'ssHomeCtrl',
        templateUrl: 'src/home/home.html'
    });
});
