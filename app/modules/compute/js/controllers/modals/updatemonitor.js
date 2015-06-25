/**
 * Created by rGilchrist on 10/28/13.
 */
/* global angular, console, $ */
angular.module('cloudweb').controller('UpdateMonitor', [
    '$scope',
    'AppData',
    'MonitorsService',
    function ($scope, AppData, MonitorsService) {

        'use strict';

        $scope.oldMonName = $scope.mon.name;

        var uniqueNames = [];
        $scope.$parent.$watch('instance', function(s){
            if (s){
                $scope.mon.server_id = s.platformId;
                $scope.mon.uid ='/zport/dmd/Devices/Server/Linux/devices/' + s.ip;
            }
        });
        $scope.updateMode = true;

        if ($scope.mon.ticketOptions &&
            $scope.mon.ticketOptions.primary_contact &&
            $scope.mon.ticketOptions.primary_contact.phone.length > 0){
            $scope.monitorAction = 'ticket';
        }else{
            $scope.monitorAction = 'email';
        }

        $scope.ticketMode = function(){

            var enable = $scope.monitorAction === 'ticket';

            if (enable){
                $scope.mon.ticketOptions = {
                    script: '',
                    restart: false,
                    impact: "3-Multiple Users",
                    urgency: "3-Medium",
                    primary_contact: { phone: '' },
                    secondary_contact: { phone: '' }
                };
            }
            else{
                delete $scope.mon.ticketOptions;
            }
            $scope.mon.sd_ticket = enable;
        };

        var resetModel = function(){

            $scope.$parent.setPingMonitored();

            $scope.mon.template = null;
            $scope.mon.name = "";
            $scope.mon.email = AppData.getUser().email;
            $scope.created = new Date().toISOString();
            $scope.created_by = AppData.getUser().email;
            $scope.data = {
                cycletime: '60', //default value in PF
                timeout: '15', //default value in PF
                useSsl: false, //
                port: '80',
                url: '/'
            };
        };

        $scope.updateMonitor = function(){

            if($scope.requestPending){return;}

            $scope.requestPending = true;

            var mon = $scope.mon;
            var ipArray = mon.uid.split('/');
            var ip = ipArray[ipArray.length-1];

            var updateData = {
                name: mon.name,
                oldName: $scope.oldMonName,
                uid: mon.uid,
                server_id: mon.server_id,
                ip_address: ip,
                template: mon.template,
                action: 'update',
                state: 'enabled',
                email: AppData.getUser().email,
                created: new Date().toISOString(),
                severity:'4', //5 ticket 4 email
                method:'GET',
                created_by:AppData.getUser().email,
                impact: "3-Multiple Users",
                urgency: "3-Medium",
                data: {
                    cycletime: '60', //default value in PF
                    timeout: '15', //default value in PF
                    useSsl: mon.data.useSsl, //
                    port: '80',
                    url: '/'
                }
            };

            $scope.validateMonitorName();
            $scope.$parent.requestPending = true;

            if($scope.formValid){
                MonitorsService.updateMonitor(updateData).then(function(response){

                    $scope.$parent.immediateUpdate(function(){
                        $scope.hide();
                        resetModel();
                        $scope.requestPending = false;
                    });

                });
            }
        };

        $scope.validateMonitorName = function(){

            $scope.monitorNameUnique = $scope.mon.name.length > 0 &&
                uniqueNames.indexOf($scope.mon.name) === -1;
            $scope.validateForm();
        };

        $scope.$on("modal-shown", function(){

            $scope.$parent.modalIsActive = true;
            $scope.$parent.clearInterval();

            $scope.monitorNameIsValid = false;
            $scope.monitorEmailIsValid = false;
            $scope.validateForm();
        });

        $scope.$on("modal-hidden", function(evt){
            $scope.$parent.modalIsActive = false;
        });

        /* //TODO - there is an issue with this directive
         the tooltip is firing this when it shouldn't
         $scope.$on("modal-hidden", function(evt){


         });
         */

        $scope.closeModal = function(){

            $scope.hide();
            $scope.$parent.immediateUpdate(function(){
                resetModel();
            });
        };

        $scope.showTemplate = function(){

            if($scope.mon.template === 'http' || $scope.mon.template === 'https' ){
                return true;
            } else {
                return false;
            }
        };

        $scope.clearInterval = function(){
            $scope.$parent.clearInterval();
        };

        $scope.templateChange = function(){
            $scope.mon.data.useSsl = $scope.mon.template === 'https';
        };

        $scope.monitorNameUnique = true;

        $scope.validateMonitorName = function(v){

            $scope.monitorNameUnique = $scope.mon.name.length > 0 &&
                uniqueNames.indexOf($scope.mon.name) === -1;
            $scope.validateForm();
        };

        $scope.validateForm = function(){

            if (!$scope.monitorForm){
                return;
            }

            if ($scope.mon.template !== 'ping' && !$scope.monitorNameUnique){
                $scope.formValid = false;
            }
            else{
                $scope.monitorEmailIsValid = $scope.monitorForm.emailInput.$valid;

                $scope.monitorNameIsValid = true;

                $scope.formValid = $scope.monitorNameIsValid && (!$scope.mon.ticketOptions ||
                    $scope.monitorForm.primaryPhone.$valid);
            }
            if( $scope.mon.data.cycletime === '' ||
                $scope.mon.data.timeout === ''){
                $scope.formValid = false;
            }
        };

    }]
);