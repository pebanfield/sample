/**
 * Created with JetBrains WebStorm.
 * User: rGilchrist
 * Date: 9/18/13
 * Time: 2:19 PM
 * To change this template use File | Settings | File Templates.
 */
/* global angular, console, $, _*/
angular.module('cloudweb').controller('ProvisionBaseCtrl', [
    '$scope',
    'AppData',
    'ServerActions',
    '$location',
    function ($scope, AppData, ServerActions, $location) {
        'use strict';

        var currentPath = $location.path();
        if(currentPath !== "/compute/provision/required"){
            $location.path('/compute/provision/required'); //force redirect to start for browser refresh
        }
        $scope.showOptionsBtn = false;
        $scope.showCancel = false;
        $scope.showPrevBtn = false;
        $scope.showNextBtn = false;
        $scope.showCreateBtn = false;
        $scope.isValid = false;
        $scope.supported = false;
        $scope.showDomain = false;
        $scope.showAppStack = false;

        $scope.steps = [{name: 'required', path: '/compute/provision/required'},
                        {name: 'options', path: '/compute/provision/options'},
                        {name: 'confirm', path: '/compute/provision/confirm'},
                        {name: 'complete', path: '/compute/provision/complete'}];

        $scope.currentStepIndex = 0;
        $scope.isProvisioning = false;

        $scope.size = 'micro';

        $scope.instance = {
            name: '',
            zoneId: null,
            zone: null,
            imageId: null,
            image: null,
            flavorId: null,
            flavor: null,
            recipe: null,
            cloudInitData:undefined
        };

        $scope.selectedImage = null;
        $scope.currentDomains = null;
        $scope.currentRecipes = null;

        if(!$scope.sizes){
            $scope.sizes = [];
        }

        if(!$scope.flavors){
            $scope.flavors = [];
        }

        if(!$scope.zones){
            $scope.zones = [];
        }

        if(!$scope.images){
            $scope.images = [];
        }

        if(!$scope.domains){
            $scope.domains = [];
        }

        $scope.userdata = AppData.getUserData(function(response){

            $scope.username = response.data.token.username;
            $scope.email = response.data.token.email;
            $scope.instance.osSupportServiceContactEmail = $scope.email;
        });

        $scope.showNext = function(){

            $scope.currentStepIndex++;
            if($scope.currentStepIndex < $scope.steps.length){

                var path = $scope.steps[$scope.currentStepIndex].path;
                $location.path(path);
            }

        };

        $scope.showPrevious = function(){

            if($scope.currentStepIndex > 0){

                $scope.currentStepIndex--;
            }
            var path = $scope.steps[$scope.currentStepIndex].path;
            $location.path(path);
        };

        $scope.cancel = function(){

            $location.path('/#/compute/zones');
        }

        /*
        $scope.showOptions = function(){

            $scope.currentStepIndex++;
            $scope.steps.splice($scope.currentStepIndex, 0, {name: 'options', path: '/compute/provision/options'});
            var path = $scope.steps[$scope.currentStepIndex].path;
            $location.path(path);
        };
        */

        $scope.clearOptions = function(){

        };

        $scope.provisionVM = function(){

            $scope.isProvisioning = true;

            var vmSettings = {
                name: $scope.instance.name,
                flavorId: $scope.instance.flavor.id,
                imageId: $scope.instance.image.id,
                cloudInitData: $scope.instance.cloudInitData
            };

            if ($scope.instance.admins){
                vmSettings.admins = [$scope.instance.admins];
            }
            if ($scope.instance.recipe){
                vmSettings.recipes = [$scope.instance.recipe.name];
            }
            if($scope.supported){
                vmSettings.osSupportService = {
                "enable": true,
                    "contactEmail": $scope.instance.osSupportServiceContactEmail,
                    "contactPhone": $scope.instance.osSupportServiceContactPhone
                    };
            }

            ServerActions.provisionVM({instance:vmSettings}, $scope.instance.zone.id).then(function(result){

                if (result.status === 202){
                    $scope.instanceId = result.data.instance.id;
                    $scope.isProvisioned = true;
                    $scope.currentStepIndex++;
                    var path = $scope.steps[$scope.currentStepIndex].path;
                    $location.path(path);

                } else {
                    //TODO - error handling
                }
            });
        };

    }
]);