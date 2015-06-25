angular.module('cloudweb')
  .controller('ListViewCtrl',
    [        '$scope', '$rootScope', '$timeout', 'AppData', 'InstanceDataProvider', 'MonitorsService', 'ServerActions',
    function ($scope,   $rootScope,   $timeout,   AppData,   InstanceDataProvider,   MonitorsService,   ServerActions ) {
      'use strict';

      this.predicate = 'createdAt';

      this.reverse = true;

      this.sortInstances = function(col){
        this.reverse = col === this.predicate ? !this.reverse : true;
        this.predicate = col;
      };

      this.sortClass = function(col){
        return col === this.predicate ? 'fa fa-sort-' + (this.reverse ? 'down' : 'up') : '';
      };

      this.monitorClass = function(status){
        switch(status){
          case 'inactive':
            return 'fa fa-exclamation text-warning';
          break;
          case 'ready':
            return 'fa fa-bullseye text-info';
          break;
          case 'active_no_events':
            return 'fa fa-bullseye text-success';
          break;
          case 'active_events':
            return 'fa fa-bullseye text-error';
          break;
          default :
            return 'fa fa-exclamation text-warning';
        }
      };
      //
      //$scope.timeout = false;


      //$scope.startInstancesChron = function(){

        //if(intervalId){
          //$timeout.cancel(intervalId);
        //}

        //intervalId = $timeout(function(){

          //InstanceDataProvider.updateInstances($scope.instances).then(function(){

            ////prune deleted instances
            //$.each($scope.instances, function(c, cInst){

              //if(!cInst){
                //delete $scope.instances[c];
                //$scope.instances.splice(c, 1);
              //}
            //});
            ////start chron
            //$scope.startInstancesChron();
          //});
        //}, 10000);
      //};

      //$scope.stopInstancesChron = function(){
        //if(intervalId){
          //$timeout.cancel(intervalId);
        //}
      //};

      ////entry
      //$scope.$on('$stateChangeSuccess', function(event){

        //$scope.lastZone = AppData.getLastZone();
        //$scope.populateServers();
      //});

      ////exit
      //$rootScope.$on("$stateChangeSuccess", function(){

        //if(intervalId){
          //$timeout.cancel(intervalId);
        //}
      //});

      //$scope.immediateUpdate = function(callback){

        //if(intervalId){
          //$timeout.cancel(intervalId);
        //}
        //$scope.populateServers(callback);
      //};

      //$scope.loadTable = function(){

        //$scope.loaded = false;
        //$scope.lastZone = $scope.currentZone;
        //$scope.populateServers(function(){
          //$scope.loaded = true;
        //});
      //};

      //$scope.matchLastZone = function(lastZoneId){

        ////default to 0 index
        //var currentZone = $scope.zoneList[0];

        //if(lastZoneId === 'all'){
          //currentZone = $scope.zoneList[$scope.zoneList.length-1];
        //} else {
          //for(var j=0; j<$scope.zoneList.length; j++){
            //if($scope.zoneList[j].id === lastZoneId){
              //currentZone = $scope.zoneList[j];
            //}
          //}
        //}

        //return currentZone;
      //};

      //$scope.populateServers = function(callback){

        //var lastZoneId;
        //try{
          //lastZoneId = $scope.lastZone.id;
        //} catch(error) {
          //lastZoneId = null;
        //}

        //InstanceDataProvider.getInstanceData(lastZoneId, true, true).then(function(instanceData){

          //$scope.resources = instanceData.resources;
          //if($scope.resources.length === 0){
            //$scope.isZoneEmpty = true;
          //} else {
            //$scope.isZoneEmpty = false;
          //}

          //var zoneList = [{id: 'all', name: 'All Zones'}];
          //$scope.zoneList = instanceData.zones.concat(zoneList);

          //$scope.currentZone = $scope.matchLastZone(lastZoneId);

          //$scope.loaded = true;

          //if(!$scope.zoneList || $scope.zoneList.length < 1){
            //$scope.noZones = true;
          //}

          //if($scope.lastZone){
            //AppData.setLastZone($scope.lastZone);
          //}

          //MonitorsService.getMaasData($scope.instances);
          //$scope.startInstancesChron();

          //if(callback){
            //callback();
          //}

        //}, function(error){
          //$scope.timeout = true;
          //$scope.noZones = true;
          //if(callback){
            //callback(error);
          //}
        //});
      //};




        //$scope.showMonitorStatus = function(status, msg){

            //return MonitorsService.showMonitorStatus(status, msg);
        //};

        //$scope.requestVip = function(instance){
            //ServerActions.createVIP(instance.zoneId, instance.id).then(function(result){
                //instance.vip.status = 'Creating';
            //});

        //};
        //$scope.deleteVip = function(instance){
            //ServerActions.deleteVIP(instance.zoneId, instance.id).then(function(result){
                //instance.vip.status = 'Deleting';
            //});
        //};
    }
]);

