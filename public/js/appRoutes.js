angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'mainController'
        })

        // nerds page that will use the NerdController
        .when('/items', {
            templateUrl: 'views/items.html',
            controller: 'dataEntryController'
        })

        .when('/page3', {
            templateUrl: 'views/page3.html',
            controller: 'mainController'
        })

        .when('/user', {
            templateUrl: 'views/user.html',
            controller: 'mainController'
        });

    $locationProvider.html5Mode(true);

}]);