/**
 * Created by pbanfield on 12/8/13.
 */

/* global angular, require, console, $, _ */

(function () {

    'use strict';

    angular.module('cloudweb').
        controller('ProvisionCompleteCtrl',
            ['$scope',
                function($scope) {

                    $scope.$parent.showOptionsBtn = false;
                    $scope.$parent.showCancel = false;
                    $scope.$parent.showPrevBtn = false;
                    $scope.$parent.showNextBtn = false;
                    $scope.$parent.showCreateBtn = false;

                    if($scope.instance &&
                        $scope.instance.image &&
                        $scope.instance.image.os.manufacturer === 'Microsoft'){
                        $scope.isWindows = true;
                    }
                    else if($scope.instance.admins) {

                        $scope.isLinux = true;
                        $scope.sshStr =
                            'ssh ' + $scope.instance.admins.domain +
                             '\\\\' + $scope.instance.admins.username + '@[vm internal IP]';
                    } else {
                        $scope.isLinuxNoAccess = true;
                    }

                    $scope.currentVNCurl = '/#/compute/instances/id/' + $scope.instanceId + '/vnc';
                }]);

}());
