(function () {

    'use strict';

    angular.module('cloudweb').
        controller('MainCtrl',
        ['$scope', '$location',

        function($scope, $location) {

            //redirect after login
            if($scope.request_path && $scope.request_path !== ""){
                $location.path($scope.request_path);
                $scope.request_path = null;
            }

    }]);

}());
