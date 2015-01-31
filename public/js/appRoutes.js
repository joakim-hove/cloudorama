angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'mainController'
        })

        // nerds page that will use the NerdController
        .when('/page2', {
            templateUrl: 'views/page2.html',
            controller: 'mainController'
        });

    $locationProvider.html5Mode(true);

}]);