/**
 * Created with JetBrains WebStorm.
 * User: rGilchrist
 * Date: 9/6/13
 * Time: 11:16 AM
 * To change this template use File | Settings | File Templates.
 */
/* global angular */

angular.module('csf.services').factory('DNSService', [
    '$q',
    '$http',
    'AppData',
    '$rootScope',
    function($q, $http, AppData, $rootScope) {
        'use strict';

        var api = {
            testAvailability: _testAvailability,
            addRecord: _addRecord,
            deleteRecord: _deleteRecord,
            getRecords: _getRecords
        };

        function _testAvailability(newrecord, suffix, callback){
            var dnsRegex = new RegExp(/^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$/);
            if (!dnsRegex.test(newrecord)){
                callback('invalid');
            }
            else{
                $http({
                    method:'GET',
                    url:'cloudapi/dns/domains/' + suffix + '/records/' + newrecord,
                    headers: httpHeaders(),
                    cache: false
                }).success(function(data){
                    callback(data.length === 0 ? 'available' : 'unavailable');
                }).error(function(data, status, headers, config) {
                    $rootScope.exceptionHandler(data, "Error : " + status, headers, config);
                    callback('error');
                });
            }
        }

        function _addRecord(record, suffix, ip, callback){
            modifyRecord({
                method:'POST',
                record:record,
                suffix:suffix,
                ip:ip,
                callback:callback
            });
        }

        function _deleteRecord(record, suffix, ip, callback){
            modifyRecord({
                method:'DELETE',
                record:record,
                suffix:suffix,
                ip:ip,
                callback:callback
            });
        }

        function _getRecords(ip, callback){

            $http({
                method: 'GET',
                url:'cloudapi/compute/v1/instances/' + ip + '/records',
                headers: httpHeaders(),
                cache: false
            }).success(function(data){
                    callback(data);
                }).error(function(data) {
                $rootScope.exceptionHandler(data, "Error: DNSService.getRecords");
            });
        }

        var modifyRecord = function(args){
            var httpArgs = {
                method:args.method,
                url: 'cloudapi/dns/domains/' + args.suffix + '/records',
                headers: httpHeaders(),
                cache: false
            };
            if (args.method === 'POST'){
                httpArgs.data =  [{
                    data: [args.ip],
                    name: args.record,
                    type: 'A',
                    ttl: 300
                }];
            }
            else {
                httpArgs.url += '/' + args.record;
            }
            $http(httpArgs).success(function(response){
                if (response.rcode === 'NOERROR'){
                    _getRecords(args.ip, function(data){
                        var dnsData = {
                            ip:args.ip,
                            dnsRecords:data
                        };

                        $rootScope.$emit('dnsrecord', dnsData);
                    });
                    args.callback(true);
                }
                else{
                    args.callback(false);
                }
            })
            .error(function(data, status, headers, config) {
                $rootScope.exceptionHandler(data, "Error : " + status, headers, config);
                args.callback(false);
            });
        };

        var httpHeaders = function() {
            return {
                'Content-Type': 'application/json',
                Authorization: AppData.getToken()
            };
        };

        return api;
    }
]);
