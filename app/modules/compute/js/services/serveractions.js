angular.module('csf.services').factory('ServerActions', [
    '$q',
    'AppData',
    'DNSService',
    '$http',
    function($q, AppData, DNSService, $http) {
        'use strict';

        var api = {
            provisionVM: _provision,
            suspendVM: _suspend,
            resumeVM: _resume,
            deleteVM: _delete,
            createVIP:_createVIP,
            deleteVIP:_deleteVIP
        };

        /*
        * Args: flavorId, imageId, name, chefId, zoneId
        * */
        function _provision(opts, zoneId){

            return $http({
                method: 'POST',
                url:'cloudapi/compute/zones/' + zoneId + '/instances',
                headers: httpHeaders(),
                cache: false,
                data: opts
            });
        }

        function _suspend(zoneId, instanceId){
            return instanceAction(zoneId, instanceId, 'suspend');
        }

        function _resume(zoneId, instanceId){
            return instanceAction(zoneId, instanceId, 'resume');
        }
        function _createVIP(zoneId, instanceId){
            return instanceAction(zoneId, instanceId, 'createVip');
        }
        function _deleteVIP(zoneId, instanceId){
            return instanceAction(zoneId, instanceId, 'deleteVip');
        }

        var instanceAction = function(zoneId, instanceId, action){
            var actionData = {};
            actionData[action] = null;

            // suspend, resume createVip, deleteVip

            return $http({
                method: 'POST',
                url:'cloudapi/compute/zones/' + zoneId + '/instances/' + instanceId + '/action',
                headers: httpHeaders(),
                cache: false,
                data:actionData
            });
        };

        function _delete(zoneId, instanceId){
            return $http({
                method: 'DELETE',
                url:'cloudapi/compute/zones/' + zoneId + '/instances/' + instanceId,
                headers: httpHeaders(),
                cache: false
            });
        }

        var _httpHeaders;
        var httpHeaders = function() {
            if (!_httpHeaders){
                _httpHeaders =  {
                    'Content-Type': 'application/json',
                    Authorization: AppData.getToken()
                };
            }
            return _httpHeaders;
        };

        return api;
    }
]);
