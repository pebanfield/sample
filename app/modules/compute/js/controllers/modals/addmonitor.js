/**
 * Created by rGilchrist on 10/2/13.
 */
/* global angular, console, $ */
angular.module('cloudweb').controller('AddMonitor', [
    '$scope',
    '$rootScope',
    'AppData',
    'MonitorsService',
    'InstanceDataProvider',
    '$timeout',
    function ($scope, $rootScope, AppData, MonitorsService, InstanceDataProvider, $timeout) {
        'use strict';

        var uniqueNames;
        var ttScope = $rootScope.$new();

        $scope.$parent.$watch('instance', function(s){
            if (s){
                $scope.instanceId = s.platformId;
                $scope.mon.server_id = $scope.instanceId;
                $scope.mon.ip_address = s.ip;
                $scope.mon.platform = s.platform;
            }
        });

        $scope.updateMode = false;

        var setModel = function(){
            $scope.mon = {
                name:'',
                template: null,
                platform: '',
                server_id: '',
                ip_address: '',
                action: 'create',
                email: AppData.getUser().email,
                state: 'enabled',
                created: new Date().toISOString(),
                severity:'4', //5 ticket 4 email
                method:'GET',
                created_by:AppData.getUser().email,
                impact: "3-Multiple Users",
                urgency: "3-Medium",
                data: {
                    cycletime: '60', //default value in PF
                    timeout: '15', //default value in PF
                    useSsl: false, //
                    port: '80',
                    url: '/'
                }
            };
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

        $scope.templates = [];

        $scope.$watch('monitors', function(){
            $scope.templates = [];
            $scope.template = 'http';
            if ($scope.monitors){
                uniqueNames = [];
                $.each($scope.monitors, function(){
                    uniqueNames.push(this.name);
                });
                if(!$scope.monitors.pingUsed && !$scope.$parent.pingMonitored){
                    $scope.templates.push('ping');
                    $scope.template = 'ping';
                }
            }
            $scope.templates.push('http', 'https');

            // preselect defaults
            $timeout(function(){
                $scope.monitorAction = 'email';
                $scope.mon.template = $scope.templates[0];
                $scope.ticketMode();
            });
        });

        $scope.createMonitor = function(){

            if($scope.requestPending){return;}

            $scope.validateMonitorName();

            if($scope.formValid){

                $scope.requestPending = true;
                MonitorsService.createMonitor($scope.mon).then(function(response){

                    $scope.$parent.immediateUpdate(function(){
                        $scope.hide();
                        resetModel();
                        $scope.requestPending = false;
                    });

                });
            }

        };

        $scope.testResult = 0;

        $scope.testMonitor = function(){
            $scope.testResult = false;
            $scope.$parent.requestPending = true;
            MonitorsService.testMonitor($scope.mon).then(function(response){
                $scope.$parent.requestPending = false;
                $scope.formValid = true;
                $scope.testResult = response.status;
            });
        };

        $scope.$on("modal-shown", function(evt){

            $scope.$parent.clearInterval();
            $scope.validateForm();
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
            $scope.validateForm();
        };

        $scope.templateChange = function(){

            $scope.mon.template = $scope.template;

            $scope.template === 'https' ? $scope.mon.data.useSsl=true : $scope.mon.data.useSsl=false;
        };

        $scope.showTemplate = function(){

           if($scope.mon.template === 'http' || $scope.mon.template === 'https' ){
               return true;
           } else {
               return false;
           }
        };

        $scope.monitorNameUnique = true;

        $scope.validateMonitorName = function(){

            $scope.monitorNameUnique = $scope.mon.name.length > 0 &&
                uniqueNames.indexOf($scope.mon.name) === -1;
            $scope.validateForm();
        };

        $scope.formValid = false;
        $scope.validateForm = function(){
            if (!$scope.monitorForm){
                return;
            }
            if($scope.mon.name === ""){
                $scope.formValid = false;
            }
            if ($scope.mon.template !== 'ping' && !$scope.monitorNameUnique){
                $scope.formValid = false;
            }
            else{
                $scope.monitorEmailIsValid =  $scope.monitorForm.emailInput.$valid;

                $scope.formValid = $scope.monitorEmailIsValid && (!$scope.mon.ticketOptions ||
                    $scope.monitorForm.primaryPhone.$valid);
            }

        };

        setModel();
    }]
);
