var SSOServices = angular.module('appServices', ['ngResource']);

SSOServices.factory('UserData', ['$resource',
    function($resource){
        return $resource('/api/userData', {}, {
            query: {method:'GET', params:{}, isArray:false}
        });
    }]);

SSOServices.factory('Items', ['$resource',
    function($resource){
        return $resource('/api/dataItems', {}, {
            query: {method:'GET', params:{}, isArray:false}
        });
    }]);