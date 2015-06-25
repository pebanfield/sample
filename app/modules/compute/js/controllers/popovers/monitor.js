/**
 * Created by rGilchrist on 10/1/13.
 */
/* global angular */
angular.module('cloudweb').controller('MonitorDetail', [
    '$scope',
    '$q',
    'MonitorsService',
    'AppData',
    '$modal',
    function ($scope, $q, MonitorsService, AppData, $modal) {
        'use strict';

        $scope.clearInterval = function(){
            console.log("CLEAR INTERVAL");
            $scope.$parent.clearInterval();
        };
    }]
);