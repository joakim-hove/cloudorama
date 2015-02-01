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
        $scope.userData['dept'] = $scope.rawUserData['extensionAttribute5'];
        $scope.userData['title'] = $scope.rawUserData['title'];
        $scope.userData['email'] = $scope.rawUserData['urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress'];
        $scope.userData['desk'] = $scope.rawUserData['physicalDeliveryOfficeName'];
    });

}]);