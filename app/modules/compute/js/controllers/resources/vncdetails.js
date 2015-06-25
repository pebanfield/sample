/**
 * Created by pbanfield on 11/24/13.
 */

/* global angular, require, console, $, _ */

(function () {

    'use strict';

    angular.module('cloudweb').
        controller('DeviceVNCCtrl',
            ['$scope',
             'InstanceDataProvider',
                '$sce',
                function($scope, InstanceDataProvider, $sce) {
                    $scope.setActiveTab();

                    var getVNC = function(){
                        InstanceDataProvider.getVNC($scope.instance.zoneId, $scope.resourceId).then(function(response){

                            $scope.vnc_url = $sce.trustAsResourceUrl(response.console.url);
                            $scope.isLoading = false;
                        });
                    };
                    $scope.getInstanceData(false, getVNC);
                }
            ]);
}());

