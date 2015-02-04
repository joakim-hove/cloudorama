var appControllers = angular.module('appControllers', []);

appControllers.controller('mainController', ['$scope', 'UserData', function ($scope, UserData) {
    $scope.tagline = 'To the moon and back!';
    $scope.userData = UserData.query();
}]);

appControllers.controller('dataEntryController', ['$scope', 'UserData', 'Items', function ($scope, UserData, Items) {
    $scope.userData = UserData.query();
    $scope.dataItems = Items.query();
    console.log($scope.items);
}]);


appControllers.controller('notLoggedInController', ['$scope', function ($scope) {

}]);
