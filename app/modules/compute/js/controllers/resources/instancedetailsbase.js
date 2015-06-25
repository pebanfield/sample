/**
 * Created with JetBrains WebStorm.
 * User: pbanfield
 * Date: 9/4/13
 * Time: 11:40 AM
 *
 */


/* global angular, require, console, $, _ */
(function () {

    'use strict';

    angular.module('cloudweb').
        controller('InstanceDetailsBaseCtrl',
            ['$scope',
             '$location',
             'InstanceDataProvider',
             'MonitorsService',
             function($scope, $location, InstanceDataProvider, MonitorsService) {

                 $scope.initialize = function(){

                     $scope.monitoringEnabled = false;
                     $scope.navType = 'pills';
                     $scope.instanceId = '';

                     $scope.tabs = [
                         { title:"Summary", id: "summary"},
                         { title:"Monitoring", id: "monitoring"},
                         { title:"Metrics", id: "metrics"},
                         { title:"VNC (Terminal)", id: "vnc"}
                     ];

                     $scope.renderTabView = function() {
                         $location.path("/compute/zones/id/" + $scope.zoneId +
                             "/resources/id/" + $scope.resourceId + "/" + this.tab.id);
                     };
                 };

                 $scope.activePage = "";
                 $scope.initialize();

                 $scope.setActiveTab = function() {

                     var currentLoc = $location.path();

                     try {
                         var locArray = currentLoc.split("/");
                         $scope.zoneId = locArray[4];
                         $scope.resourceId = locArray[7];
                         $scope.activePage = locArray[8];
                         var activeTab = _.find($scope.tabs,{ id: $scope.activePage });
                         activeTab.active = true;
                     } catch(e) {
                         $scope.exceptionHandler(e);
                     }
                 };

                 var addLogTab = function(platform){

                     if(platform && platform.toLowerCase().indexOf('windows') === -1){

                         var hasLogTab = false;

                         $.each($scope.tabs, function(t, tab){
                             if(tab.id === 'log'){
                                 hasLogTab = true;
                             }
                         });

                         if(!hasLogTab){
                             $scope.tabs.push({ title:"Log", id: "log"});
                         }
                     }
                 };

                 //TODO - refactor to resource at some point
                 $scope.getInstanceData = function(showMaas, callback){

                     InstanceDataProvider.getInstanceDetails($scope.zoneId, $scope.resourceId, true, false).then(function(result){

                         $scope.instance = result;

                         $scope.supportemail = 'mailto:serviceoperationscenterticket@disney.com?subject=ODC%20Support%20Request%20-%20ODCS-' + $scope.instance.platformId + '&body=%0ADescribe%20in%20detail%20the%20nature%20of%20your%20request';
                         if($scope.instance.osSupportServiceStatus === 'ACTIVE' ||
                             $scope.instance.osSupportServiceStatus === 'REQUESTED'){
                             $scope.showSupportStatus = true;
                         } else {
                             $scope.showSupportStatus = false;
                         }

                         addLogTab($scope.instance.platform);

                         if(callback && !showMaas){
                             callback();
                         } else {

                             var deviceList = [{platformId:$scope.instance.platformId,
                                 ip:$scope.instance.ip,
                                 name:$scope.instance.name}];

                             MonitorsService.getMaasByInstance($scope.instance.platformId, deviceList).then(function(result){

                                 if(result && result.status){
                                     $scope.monitoringEnabled = true;
                                 } else {
                                     $scope.monitors = [];
                                     $scope.events = [];
                                 }
                                 if (callback){
                                     callback(result);
                                 }
                             });
                         }

                         InstanceDataProvider.getPatches($scope.instance.platformId).then(function(response){

                             if (response.data && response.data.count && response.data.count > 0){
                                 $scope.tabs.push({title:'Patches', id: 'patches'});
                                 $scope.patches = response.data.patches;
                             }
                         });

                     });

                 };
                 $scope.editName = function(){
                     $scope.editingName = true;
                     $scope.nameAvailable = false;
                 };
             }]);

}());
