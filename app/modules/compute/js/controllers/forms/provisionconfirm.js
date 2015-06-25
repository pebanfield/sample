/**
 * Created by pbanfield on 12/8/13.
 */

/* global angular, require, console, $, _ */

(function () {

    'use strict';

    angular.module('cloudweb').
        controller('ProvisionConfirmCtrl',
            ['$scope',
                function($scope) {

                    if($scope.instance.ossupport){
                        $scope.ossupportText = 'yes';
                    } else {
                        $scope.ossupportText = 'no';
                    }

                    $scope.$parent.showOptionsBtn = false; //TODO - can we show this here?
                    $scope.$parent.showCancel = true;
                    $scope.$parent.showPrevBtn = true;
                    $scope.$parent.showNextBtn = false;
                    $scope.$parent.showCreateBtn = true;
                    $scope.isValid = true;

                    $scope.account = 'none';
                    $scope.domain = 'none';
                    $scope.recipe = 'none';
                    $scope.cloudInitData = 'none';

                    if($scope.instance.admins){
                        $scope.account = $scope.instance.admins.username;
                        $scope.domain = $scope.instance.admins.domain;
                    }
                    if($scope.instance.cloudInitData){
                        $scope.cloudInitData = $scope.instance.cloudInitData;
                    }
                    if($scope.instance.recipe){
                        $scope.recipe = $scope.instance.recipe.name;
                    }

                }]);

}());
