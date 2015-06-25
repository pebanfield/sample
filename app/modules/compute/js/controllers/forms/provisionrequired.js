/**
 * Created by pbanfield on 12/8/13.
 */


/* global angular, require, console, $, _ */

(function () {

    'use strict';

    angular.module('cloudweb').
        controller('ProvisionRequiredCtrl',
            ['$scope',
             '$q',
             'InstanceDataProvider',
             'ComputeDataParser',
                function($scope,
                         $q,
                         InstanceDataProvider,
                         ComputeDataParser) {

                    var _cdp;

                    var _prepareData = function(){

                        $q.all([
                                InstanceDataProvider.getImages(),
                                InstanceDataProvider.getFlavors(),
                                InstanceDataProvider.getZones(),
                                InstanceDataProvider.getRecipes(),
                                InstanceDataProvider.getDomains()])
                            .then(function(results){

                                $scope.$parent.images = results[0].images;

                                $scope.$parent.flavors = [];
                                var flavors = results[1].flavors;

                                $.each(flavors, function(f, flavor){

                                    var newFlavor = {};
                                    if(flavor.isPublic){
                                        newFlavor.label = flavor.label;
                                        newFlavor.dailyPrice = flavor.dailyPrice;
                                        newFlavor.disk = flavor.disk;
                                        newFlavor.ramGB = flavor.ramGB;
                                        newFlavor.id = flavor.id;
                                        newFlavor.vcpus = flavor.vcpus;
                                        newFlavor.longLabel = flavor.label + " : " +
                                            flavor.vcpus + " cpus " + (flavor.ram/1024) +
                                            "GB" + " - " + "$" + flavor.dailyPrice + "/per day";
                                        $scope.$parent.flavors.push(newFlavor);
                                    }
                                    $scope.validate();

                                });

                                $scope.$parent.flavors.sort(function(a,b){return a.dailyPrice- b.dailyPrice});


                                $scope.$parent.zones =  results[2].zones;

                                var defaultZone = {id: 'default', name: '[select zone]'};
                                //$scope.zones.push(defaultZone);
                                // $scope.instance.zone = defaultZone;
                                $scope.$parent.recipes = results[3].recipes;
                                $scope.$parent.domains = results[4].domains;

                                $scope.$parent.isLoaded = true;
                        });
                    };

                    $scope.initialize = function(){

                        _cdp = ComputeDataParser;

                        $scope.labelIsValid = false;
                        $scope.imageIsValid = false;
                        $scope.zoneIsValid = false;
                        $scope.sizeIsValid = false;

                        $scope.$parent.showOptionsBtn = true;
                        $scope.$parent.showCancel = true;
                        $scope.$parent.showPrevBtn = false;
                        $scope.$parent.showNextBtn = true;
                        $scope.$parent.showCreateBtn = false;
                        $scope.isValid = false;

                        $scope.$parent.isProvisioning = false;
                        $scope.$parent.isProvisioned = false;
                        $scope.$parent.isLoaded = false;

                        _prepareData();

                    };

                    $scope.initialize();

                    var mapData = function(){

                        $scope.$parent.currentRecipes = [];

                        $scope.$parent.selectedImage = _cdp.findImage($scope.$parent.images, $scope.instance.imageId);

                        for(var r=0; r<$scope.$parent.selectedImage.supportedRecipes.length; r++){

                            var imageMatch =
                                _cdp.findObjById($scope.$parent.recipes, $scope.$parent.selectedImage.supportedRecipes[r]);
                            if(imageMatch){
                                $scope.$parent.currentRecipes.push(imageMatch);
                            }

                        }

                        if($scope.$parent.currentRecipes.length > 0){
                            $scope.$parent.showAppStack = true;
                        } else {
                            $scope.$parent.showAppStack = false;
                        }

                        $scope.$parent.currentDomains = [];

                        for(var d=0; d<$scope.$parent.selectedImage.supportedDomains.length; d++){

                            var domainMatch =
                                _cdp.findObjById($scope.$parent.domains, $scope.$parent.selectedImage.supportedDomains[d]);
                            if(domainMatch){
                                $scope.$parent.currentDomains.push(domainMatch);
                            }
                        }

                        if($scope.$parent.currentDomains.length > 0){
                            $scope.$parent.showDomain = true;
                        } else {
                            $scope.$parent.showDomain = false;
                        }
                    }

                    $scope.$watch('instance.imageId', function(){
                       if($scope.instance &&
                          $scope.instance.imageId){
                           mapData();
                       }
                       $scope.$parent.supported = false;
                    });

                    $scope.setFlavor = function(index){
                        $scope.flavorIndex = index;
                        $scope.instance.flavor = $scope.flavors[index];
                    };

                    $scope.showHideText = function(current){

                        if($scope.$parent.isValid){
                            current = 'options';
                        }
                        $scope.showLabelText = false;
                        $scope.showPlatformText = false;
                        $scope.showZoneText = false;
                        $scope.showSizeText = false;
                        $scope.showOptionsText = false;

                        switch(current){

                            case 'label':
                                $scope.showLabelText = true;
                                break;
                            case 'platform':
                                $scope.showPlatformText = true;
                                break;
                            case 'zone':
                                $scope.showZoneText = true;
                                break;
                            case 'size':
                                $scope.showSizeText = true;
                                break;
                            case 'options':
                                $scope.showOptionsText = true;
                                break;
                            default :
                                console.log("Error : Undefined Help Text");
                        }

                    };

                    $scope.showHideText('label');

                    $scope.setActiveInput = function(id){

                        $scope.labelIsActive = false;
                        $scope.imageIsActive = false;
                        $scope.zoneIsActive = false;
                        $scope.sizeIsActive = false;

                        switch(id){

                            case 'label':
                                $scope.labelIsActive = true;
                                break;
                            case 'platform':
                                $scope.imageIsActive = true;
                                break;
                            case 'zone':
                                $scope.sizeIsActive = true;
                                break;
                            case 'size':
                                $scope.sizeIsActive = true;
                                break;
                            default :
                                console.log("Error : Undefined Input Id");
                        }

                        $scope.currentActiveInputId = id;
                    };

                    $scope.setActiveInput('label');

                    $scope.showActiveText = function(){

                        $scope.showHideText($scope.currentActiveInputId);
                    };

                    $scope.formValid = false;
                    $scope.validate = function(){

                        bindData();

                        if($scope.instance.flavor && $scope.instance.flavorId){
                            $scope.sizeIsValid = true;
                        } else {
                            $scope.sizeIsValid = false;
                        }
                        if($scope.instance.zone && $scope.instance.zoneId){
                            $scope.zoneIsValid = true;
                        } else {
                            $scope.zoneIsValid = false;
                        }
                        if($scope.instance.image && $scope.instance.imageId){
                            $scope.imageIsValid = true;
                        } else {
                            $scope.imageIsValid = false;
                        }

                        var noSpecialCharReg = /[^A-Za-z0-9_]/;
                        var regX = new RegExp(noSpecialCharReg);

                        if($scope.instance.name !== '' && !$scope.instance.name.match(regX)){
                            $scope.labelIsValid = true;
                        } else {
                            $scope.labelIsValid = false;
                        }

                        if($scope.sizeIsValid &&
                           $scope.zoneIsValid &&
                           $scope.imageIsValid &&
                            $scope.labelIsValid){ //TODO - add more name validation
                            $scope.$parent.isValid = true;
                            $scope.showHideText('options');
                            return true;
                        } else {
                            $scope.$parent.isValid = false;
                            return false;
                        }
                    };

                    var bindData = function(){

                        $.each($scope.$parent.images, function(i, image){

                            if(image.id === $scope.instance.imageId){
                                $scope.instance.image = image;
                            }
                        });

                        $.each($scope.$parent.zones, function(z, zone){

                            if(zone.id === $scope.instance.zoneId){
                                $scope.instance.zone = zone;
                            }
                        });

                        $.each($scope.$parent.flavors, function(f, flavor){

                            if(flavor.id === $scope.instance.flavorId){
                                $scope.instance.flavor = flavor;
                            }
                        });

                    };

                    var cleanseScope = function(){

                        $scope.instance = {};
                        $scope.isConfirming = false;
                        $scope.isProvisioning = false;
                        $scope.isProvisioned = false;
                        $scope.flavorIndex = null;
                    };
                }]);

}());
