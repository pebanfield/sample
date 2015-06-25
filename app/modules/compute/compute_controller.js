angular.module('cloudweb.compute')
.controller('ComputeCtrl',
  [        '$scope', '$rootScope', 'AppData', 'InstanceDataProvider', 'MonitorsService', '$state', 'userPreferences',
  function ($scope,   $rootScope,   AppData,   InstanceDataProvider,   MonitorsService ,  $state ,  userPreferences) {
      'use strict'

      var zoomViewStates = {
        list: 'compute.resources.list',
        medium: 'compute.resources.cardMd',
        large: 'compute.resources.cardLg'
      }

      //TODO: moves the zone loading code into resolve block
      //Load Zone data
      var loadData = function(){
        populateServers(function(){
          $scope.zones = AppData.getZones();
        });
      };

      var populateServers = function(callback){
        InstanceDataProvider.getInstanceData(true).then(function(computeData){
          //TODO - wire up maas
          //MonitorsService.getMaasData($scope.instances);
          if(callback){
            callback();
          }
        }, function(error){
          //$scope.noZones = true;
          if(callback){
            callback(error);
          }
        });
      };
      loadData();

      this.onSelected = function(evt){
        loadData();
      };

      //Manage View state
      this.zoomViewState = userPreferences.viewstate.resources.size;
      //search
      this.searchText = '';

      $scope.$watch(angular.bind( this, function(){
          return this.zoomViewState;
        }),
        function(newState, oldState){
          $state.go(zoomViewStates[newState])
          AppData.setViewSize(newState);
        }
      )

      // Work Around for default child scope
      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if(toState.name === 'compute.resources') {
          $state.go(zoomViewStates[userPreferences.viewstate.resources.size])
        }
      })
    }
  ]);
