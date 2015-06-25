/**
 * Created by pbanfield on 12/8/13.
 */
(function () {

    'use strict';

    angular.module('cloudweb').
        controller('ProvisionOptionsCtrl',
            ['$scope', 'ComputeDataParser',
                function($scope, ComputeDataParser) {

                    var cdp = ComputeDataParser;

                    $scope.$parent.showOptionsBtn = false;
                    $scope.$parent.showCancel = true;
                    $scope.$parent.showPrevBtn = true;
                    $scope.$parent.showNextBtn = true;
                    $scope.$parent.showCreateBtn = false;
                    $scope.isValid = true;

                    $scope.showHideText = function(current){

                        $scope.showOSsupport = false;
                        $scope.showOSsupportSpecial = false;
                        $scope.showDomain = false;
                        $scope.showAccount = false;
                        $scope.showInitData = false;
                        $scope.showAppStack = false;

                        switch(current){

                            case 'OSsupport':
                                $scope.showOSsupport = true;
                                break;
                            case 'OSsupportSpecial':
                                $scope.showOSsupportSpecial = true;
                                break;
                            case 'domain':
                                $scope.showDomain = true;
                                break;
                            case 'account':
                                $scope.showAccount = true;
                                break;
                            case 'initData':
                                $scope.showInitData = true;
                                break;
                            case 'appStack':
                                $scope.showAppStack = true;
                                break;
                            default :
                                console.log("Error : Undefined Help Text");
                        }

                    };

                    if($scope.$parent.selectedImage && $scope.$parent.selectedImage.osSupportServicesAvailable){
                        $scope.showHideText('OSsupport');
                    } else if($scope.$parent.showDomain) {
                        $scope.showHideText('domain');
                    } else if($scope.$parent.showAppStack){
                        $scope.showHideText('appStack');
                    } else {
                        $scope.showHideText('initData');
                    }

                    $scope.setActiveInput = function(id){

                        $scope.emailIsActive = false;
                        $scope.phoneIsActive = false;

                        if(id === 'email'){
                            $scope.emailIsActive = true;
                        } else if(id === 'phone') {
                            $scope.phoneIsActive = true;
                        }

                        $scope.currentActiveInputId = id;
                    };

                    $scope.validate = function(){

                        if($scope.instance && $scope.instance.osSupportServiceContactEmail){

                            var valEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            var regXOne = new RegExp(valEmail);
                            if($scope.instance.osSupportServiceContactEmail.match(regXOne)){
                                $scope.supportEmailIsValid = true;
                            } else {
                                $scope.supportEmailIsValid = false;
                            }
                        }

                        if($scope.instance && $scope.instance.osSupportServiceContactPhone){

                            var valPhone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
                            var regXTwo = new RegExp(valPhone);
                            if($scope.instance.osSupportServiceContactPhone.match(regXTwo)){
                                $scope.supportPhoneIsValid = true;
                            } else {
                                $scope.supportPhoneIsValid = false;
                            }
                        }


                        if($scope.supportEmailIsValid && $scope.supportPhoneIsValid){
                            $scope.$parent.isValid = true;
                            return true;
                        } else {
                            $scope.$parent.isValid = false;
                            return false;
                        }
                    };

                    $scope.$watch('supported', function(){

                        if($scope.supported){

                            $scope.validate();
                            $scope.setActiveInput('phone');

                        } else {
                            $scope.$parent.isValid = true;
                        }

                    });

                    $scope.$watch('')


                }]);

}());