/**
 * Created by pbanfield on 11/24/13.
 */

/* global angular, require, console, $, _ */

(function () {

    'use strict';

    angular.module('cloudweb').
        controller('DevicePatchesCtrl',
            ['$scope',
                function($scope) {
                    $scope.setActiveTab();
                }]);

}());