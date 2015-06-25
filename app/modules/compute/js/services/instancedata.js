/**
 *
 * A data proxy for retrieving cloud api compute data.
 */

/* global angular, console, _, $ */

angular.module('csf.services').factory('InstanceDataProvider', [
    '$q',
    'AppData',
    'ComputeDataParser',
    'MonitorsService',
    '$http',
    function($q, AppData, ComputeDataParser, MonitorsService, $http) {

        'use strict';

        var api = {
            getImages: _getImages,
            getFlavors: _getFlavors,
            getRecipes: _getRecipes,
            getData: function(){return _transformedData;},
            getInstanceData: _getInstanceData,
            getInstanceDetails: _getInstanceDetails,
            getInstanceList: _getInstanceList,
            getInstanceListByZone: _getInstanceListByZone,
            getPatches: _getPatches,
            getZones: _getZones,
            getDomains: _getDomains,
            getLog: _getLog,
            getVNC: _getVNC,
            updateInstances: _updateInstances
        };

        var INSTANCES_ENDPOINT = 'cloudapi/compute/v1/instances';
        var ZONE_INSTANCES_ENDPOINT = 'cloudapi/compute/v1/instances';
        var IMAGES_ENDPOINT = 'cloudapi/compute/v1/images';
        var FLAVORS_ENDPOINT = 'cloudapi/compute/v1/flavors';
        var ZONES_ENDPOINT = 'cloudapi/compute/v1/zones';
        var DOMAINS_ENDPOINT = 'cloudapi/compute/v1/domains';
        var RECIPES_ENDPOINT = 'cloudapi/compute/v1/recipes';

        var cdp = ComputeDataParser;
        var _transformedData;
        var _flavors = null;
        var _images = null;
        var _zoneList = null;
        var _selectedZones = null;

        function _getInstanceData(getDNS){

            return _getComputeData().then(function(dataObj){

                _transformedData = cdp.transformInstanceData(dataObj, getDNS);
                AppData.updateZones(_transformedData.zones);
                var selectedRemoteZones = AppData.getSelectedRemotes();

                //request data for selected zones only
                return _mapInstances(selectedRemoteZones).then(function(response){

                    _selectedZones = response;
                    AppData.updateZones(_selectedZones);
                    _transformedData.zones = dataObj.zones;

                    return _transformedData;
                });

            });
        };

        function _getInstanceDetails(zoneId, resourceId, completeRefresh, getDNS){

            var deferred = $q.defer();

            var requestInstanceDetails = function(instanceId){

                _getComputeData().then(function(computeData){

                    _getSingleInstance(resourceId).then(function(response){

                        _transformedData = cdp.transformInstanceData(computeData, getDNS);
                        var instance = cdp.transformSingleInstance(response.instance, getDNS);

                        AppData.getZones();

                        deferred.resolve(instance);
                    });

                });
            };

            //data already loaded in _getInstanceData
            if(_transformedData && !completeRefresh){
                _getSingleInstance(resourceId);
            } else { // load if not already loaded in _getInstanceData - deep linking support
                requestInstanceDetails(resourceId);
            }

            return deferred.promise;
        }

        function _getComputeData(){

            var deferred = $q.defer();

            var imageList = _getImages();
            var flavorList = _getFlavors();
            var zoneList = _getZones();

            $q.all([imageList, flavorList, zoneList]).then(function(results){

                var rawData = {

                    images: results[0].images,
                    flavors: results[1].flavors,
                    zones: results[2].zones
                };

                deferred.resolve(rawData);
            }, function(error){
                deferred.reject(error);
            });

            return deferred.promise;
        }

        //TODO - move to ComputeDataParser?
        function _mapInstances(zones){

            var deferred = $q.defer();

            var instanceCalls = [];

            for(var z=0; z<zones.length; z++){
                instanceCalls.push(_getInstanceListByZone(zones[z]));
            }
            $q.all(instanceCalls).then(function(result){

                var zones = result;

                for(var k=0; k<zones.length; k++){

                    var zone = zones[k];

                    //TODO - refactor towards resources once this has
                    //changed in cloud api
                    if(zone.instances){

                        for(var z=0; z< zone.instances.length; z++){
                            var instance = zone.instances[z];
                            zone.instances[z] = cdp.transformSingleInstanceData(instance);
                        }

                        //TODO - refactor out instances
                        zone.resources = zone.instances;

                    } else {
                        console.log("Error : no instance data.");
                    }
                }

                deferred.resolve(zones);
            });

            return deferred.promise;
        };

        function _getInstanceList(){

            var params = {detail: 1, addVip: 1};

            return _sendRequest(INSTANCES_ENDPOINT, 'GET', null, params);
        }

        function _getInstanceListByZone(zone){

            var deferred = $q.defer();

            var params = {detail: 1, addVip: 1};

            _sendRequest(ZONES_ENDPOINT + "/" + zone.id + "/instances", 'GET', null, params).then(function(result){
                zone.instances = result.instances;
                deferred.resolve(zone);
            });

            return deferred.promise;
        }

        function _getSingleInstance(instanceId){

            var params = {detail: 1, addVip: 1};
            var url = 'cloudapi/compute/v1/instances/' + instanceId;
            return _sendRequest(url, 'GET', null, params);
        }

        function _getImages() {

            if(_images){
                return _images;
            } else {
                var params = {detail: 1, master: 1};
                return _sendRequest(IMAGES_ENDPOINT, 'GET', null, params);
            }
        }

        function _getFlavors() {

            if(_flavors){
                return _flavors;
            } else {
                var params = {detail: 1, active: 1};
                return _sendRequest(FLAVORS_ENDPOINT, 'GET', null, params);
            }

        }

        function _getZones() {

            return _sendRequest(ZONES_ENDPOINT, 'GET');
        }

        function _getDomains(){

            return _sendRequest(DOMAINS_ENDPOINT, 'GET');
        }

        function _getRecipes(){

            return _sendRequest(RECIPES_ENDPOINT, 'GET');
        }

        function _getPatches(instanceId){
            return _sendRequest('cloudapi/compute/v1/instances/' + instanceId + '/patches', 'GET');
        }

        function _getLog(zoneId, instanceId){

            var url = 'cloudapi/compute/v1/zones/' + zoneId + '/instances/' + instanceId + '/action';
            return _sendRequest(url, 'POST', {log: null});
        }

        function _getVNC(zoneId, instanceId){

            var url = 'cloudapi/compute/v1/zones/' + zoneId + '/instances/' + instanceId + '/action';
            return _sendRequest(url, 'POST', {console: null});
        }

        function _updateInstances(currentInstances){

            var deferred = $q.defer();

            _getInstanceList().then(function(response){

                var updatedInstances = response.instances;
                try {
                    currentInstances = cdp.updateStatus(currentInstances, updatedInstances);
                    deferred.resolve();
                } catch(error) {
                    console.log("update instances error : " + error);
                    deferred.reject(error);
                }

            });

            return deferred.promise;
        }

        function _sendRequest(url, methodType, dataObj, paramsObj){

            var deferred = $q.defer();

            $http({method: methodType,
                   url: url,
                   cache: false,
                   params: paramsObj,
                   data: dataObj,
                   headers: {'Content-Type': 'application/json',
                             'Authorization': AppData.getToken()}

            }).success(function(response){
                deferred.resolve(response);
            }).error(function(response){
                deferred.reject(response);
            });

            return deferred.promise;
        }

        return api;
    }
]);

