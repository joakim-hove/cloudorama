"user strict";

var mainController = angular.module('mainController', []);

mainController.controller('mainController', ['$scope', 'UserData', function ($scope, UserData) {
    $scope.tagline = 'To the moon and back!';
    $scope.userData = {};
    $scope.userData['name'] = "";
    $scope.userData['img'] = "";
    $scope.rawUserData = UserData.query(function () {
        $scope.userData['name'] = $scope.rawUserData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        $scope.userData['img'] = $scope.rawUserData['thumbnailPhoto'];
    });

}]);