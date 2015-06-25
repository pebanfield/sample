/**
 * Created by pbanfield on 11/24/13.
 */

/* global angular, require, console, $, _ */

(function () {

    'use strict';

    angular.module('cloudweb').
        controller('DeviceLogCtrl',
            ['$scope',
                'InstanceDataProvider',
                function($scope, InstanceDataProvider) {

                    $scope.setActiveTab();

                    $scope.isLoading = true;

                    var getLog = function(){
                        InstanceDataProvider.getLog($scope.instance.zoneId, $scope.resourceId).then(function(response){
                            $scope.logArray = response.log;//.split('\n');
                            $scope.isLoading = false;
                        });
                    };

                    $scope.getInstanceData(false, getLog);
                }]);

}());