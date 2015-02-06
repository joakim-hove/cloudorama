var appControllers = angular.module('appControllers', []);

appControllers.controller('mainController', ['$scope', 'UserData', function ($scope, UserData) {
    $scope.tagline = 'To the moon and back!';
    $scope.userData = UserData.query();
}]);

appControllers.controller('dataEntryController', ['$scope', 'UserData', 'Items', function ($scope, UserData, Items) {
    $scope.userData = UserData.query();
    $scope.dataItems = Items.query();
    $scope.addItem = function(newItem) {
        if (newItem.length > 0) {
            Items.add({item: newItem});
            $scope.dataItems = Items.query();
            $scope.newItem = "";
        }
    }
    $scope.removeItem = function(itemToRemove) {
        Items.remove({item : itemToRemove});
        $scope.dataItems = Items.query();
    }
}]);


appControllers.controller('notLoggedInController', ['$scope', function ($scope) {

}]);