"user strict";

var SSOServices = angular.module('SSOServices', ['ngResource']);

SSOServices.factory('UserData', ['$resource',
    function($resource){
        return $resource('/api/userData', {}, {
            query: {method:'GET', params:{}, isArray:false}
        });
    }]);
