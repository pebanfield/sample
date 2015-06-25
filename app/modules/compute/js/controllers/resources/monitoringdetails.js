/**
 * Created by pbanfield on 11/24/13.
 */

/* global angular, require, console, $, _ */

(function () {

    'use strict';

    angular.module('cloudweb').controller('DeviceMonitorCtrl',[
        '$scope',
        '$rootScope',
        '$timeout',
        'MonitorsService',
        'InstanceDataProvider',
        '$modal',
        '$q',
        function($scope, $rootScope, $timeout, MonitorsService, InstanceDataProvider, $modal, $q) {

            $scope.pingMonitored = false;
            $scope.isLoading = true;
            $scope.incidents = [];
            $scope.activeMon = null;
            $scope.requestPending = false;
            $scope.modalIsActive = false;

            var deleteModal,
                deleteModalPromise = $modal({
                    template: 'modules/compute/views/modals/deletemonconfirm.html',
                    persist: true,
                    show: false,
                    backdrop: 'static',
                    scope: $scope
                });

            $scope.deleteConfirm = function(mon) {

                $scope.clearInterval();
                $q.when(deleteModalPromise).then(function(modalEl) {

                    $scope.activeMon = mon;
                    deleteModal = modalEl;
                    deleteModal.modal('show');
                });
            };

            var severityLabelEnum = ['Clear', 'Debug', 'Info', 'Warning', 'Error', 'Critical'];
            var severityColorEnum = ['text-success', 'muted', 'text-info', 'text-warning', 'text-error', 'text-error'];

            //entry
            $scope.$on('$stateChangeSuccess', function(event){

                $scope.requestPending = false;
                $scope.setActiveTab();
                $scope.getInstanceData(true, getMonitors);
            });

            //exit
            $rootScope.$on("$stateChangeSuccess", function(){

                $scope.clearInterval();
            });

            $scope.clearInterval = function(){

                if($scope.intervalId){
                    $timeout.cancel($scope.intervalId);
                }
            };

            $scope.updateMonitoringData = function(){

                if($scope.modalIsActive){return;}

                if($scope.intervalId){
                    $timeout.cancel($scope.intervalId);
                }
                $scope.intervalId = $timeout(function(){
                    $scope.getInstanceData(true, getMonitors);
                }, 10000);
            };

            $scope.immediateUpdate = function(callback){

                if($scope.intervalId){
                    $timeout.cancel($scope.intervalId);
                }
                $scope.getInstanceData(true, function(response){
                    getMonitors(response);
                    if(callback){
                        callback();
                    }
                });
            };

            var getMonitors = function(result){

                    if(!result || !result.monitors){
                        return;
                    }

                    $scope.monitors = result.monitors;

                    $scope.events = [];

                    if(result.events){

                        //remove historical events not associated w/ active monitors
                        $.each(result.events, function(e, event){

                            $.each($scope.monitors, function(m, monitor){

                                var eventType;
                                try{
                                    if(event.eventKey){
                                        eventType = event.eventKey;
                                    } else if(event.eventGroup) {
                                        //set Ping to ping
                                        eventType = event.eventGroup.toLowerCase();
                                    }
                                } catch (error){
                                    console.log("Error : Problem with Zenoss event data.");
                                }

                                if(monitor.name === eventType){
                                    $scope.events.push(result.events[e]);
                                }
                            });
                        });
                    }

                    //default state to clear
                    $.each($scope.monitors, function(m, monitor){

                        MonitorsService.getIncidents(monitor, function(incidents){

                            $scope.incidents.concat(incidents);
                        });
                    });

                    $scope.setPingMonitored();

                    if($scope.monitors.length === 0){
                        $scope.pingMonitored = false;
                    }

                    if(result.events){
                        $.each(result.events, function(j, event){

                            event.severityLabel = severityLabelEnum[event.severity];
                            event.severityClassName = severityColorEnum[event.severity];
                        });
                    }
                    $scope.isLoading = false;
                    if(!$scope.modalIsActive){
                        $scope.updateMonitoringData();
                    }

            };

            $scope.setPingMonitored = function(){

                $.each($scope.monitors, function(i, mon){

                    if(mon.template === 'ping'){
                        $scope.pingMonitored = true;
                        return false;
                    } else {
                        $scope.pingMonitored = false;
                    }
                });
            };

            $scope.deleteMonitor = function(){

                var mon = $scope.activeMon;
                $scope.requestPending = true;

                var ipArray = mon.uid.split('/');
                var ip = ipArray[ipArray.length-1];

                var updateData = {
                    name: mon.name,
                    uid: mon.uid,
                    server_id: mon.server_id,
                    ip_address: ip,
                    template: mon.template,
                    action: 'delete',
                    state: 'enabled'
                };

                MonitorsService.updateMonitor(updateData).then(function(response){

                    $scope.immediateUpdate(function(){

                        $scope.hide();
                        $scope.requestPending = false;
                    });
                });
            };

            $scope.toggleMonitorState = function(mon){

                if($scope.requestPending){return;}

                $scope.requestPending = true;

                var ipArray = mon.uid.split('/');
                var ip = ipArray[ipArray.length-1];

                var action;
                var monStatus;
                if(mon.state==='enabled'){
                    action='disable';
                    monStatus='ready';
                } else {
                    action='enable';
                    monStatus='ready';
                }

                var updateData = {
                    name: mon.name,
                    uid: mon.uid,
                    server_id: mon.server_id,
                    ip_address: ip,
                    template: mon.template,
                    action: action,
                    status: monStatus
                };

                MonitorsService.updateMonitor(updateData).then(function(response){

                    $scope.immediateUpdate(function(){

                        $scope.requestPending = false;
                        $scope.hide();
                    });
                });
            };

            $scope.AddMonitorInvoked = function(){
                setTimeout(function(){
                    $('#radMonitorActionEmail').prop('checked', true).click();
                },300);
            };

            $scope.showMonitorStatus = function(status, msg){

                return MonitorsService.showMonitorStatus(status, msg);
            };

            $scope.showEnabled = function(state){

                if(state === 'enabled'){
                    return true;
                } else {
                    return false;
                }
            };

        }]
    );

}());
