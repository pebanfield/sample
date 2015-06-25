/**
 * Created by rGilchrist on 10/1/13.
 */
/* global angular, $, console, _ */

angular.module('csf.services').factory('MonitorsService', [
    '$q',
    '$http',
    'AppData',
    '$timeout',
    'MonitoringDataParser',
    function($q, $http, AppData, $timeout, MonitoringDataParser) {
        'use strict';

        var api = {
            getGraphs:_getGraphs,
            getImageData:_getImageData,
            createMonitor:_createMonitor,
            updateMonitor: _updateMonitor,
            testMonitor: _testMonitor,
            getIncidents: _getIncidents,
            getMaasData: _getMaasData,
            getMaasByInstance: _getMaasByInstance,
            showMonitorStatus: _showMonitorStatus
        };

        var INCIDENTS_ENDPOINT = 'maas/incidents';
        var MONITORS_ENDPOINT = 'maas/monitors';

        var mdp = MonitoringDataParser;
        //cache
        var imageData = {};
        var graphData = {};
        var _maasData;

        function _getGraphs(uid, drange, platform) {

            var deferred = $q.defer();
            var cachedGraph = graphData[uid + '_' + drange];

            if (cachedGraph){
                $timeout(function(){
                    deferred.resolve(cachedGraph);
                }, 1);
            }
            else{
                $http({
                    method: 'GET',
                    url: 'maas/metrics?uid=' + uid + '&drange=' + drange + '&platform=' + platform,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data){
                    //console.log(data);
                    graphData[uid + '_' + drange] = data;
                    //console.log('cached graph data');
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
        }

        function _getImageData(url, opts) {

            var deferred = $q.defer();

            url = url.replace(/width=500/,'width=550');
            url += mdp.getGraphDateParams(opts);//'&start=end-604800s&end=now-0s';

            var cachedImg = imageData[url];
            if (cachedImg){
                $timeout(function(){
                    deferred.resolve(cachedImg);
                }, 1);
            }
            else{
                $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'image/png'}
                }).success(function(data){
                    imageData[url] = data;
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
        }

        function _createMonitor(monitorData){

            return _sendRequest(MONITORS_ENDPOINT, 'POST', {data:monitorData});
        }

        function _updateMonitor(monitorData){

            return _sendRequest(MONITORS_ENDPOINT, 'POST', {data:monitorData});
        }

        function _testMonitor(monitorData){

            var testObj = {};
            testObj.type = monitorData.template;
            testObj.url = monitorData.data.url;

            return _sendRequest('maas/test/'+monitorData.ip_address, 'POST', {data:testObj});
        }

        function _getIncidents(monitorData){

            return _sendRequest(INCIDENTS_ENDPOINT, 'POST', {data:monitorData});
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

        function _getMaasData(instances){

            var deferred = $q.defer();

            var deviceList = [];
            $.each(instances, function(i, instance){
                deviceList.push({id:instance.platformId, ip:instance.ip, name:instance.name});
            });

            $http({
                method: 'POST',
                url:'maas/servers',
                headers: {'Content-Type': 'application/json'},
                cache: true,
                data:{devices:deviceList}
            }).success(function(response){

                    //TODO - starting to smell bad - why are we iterating over monitors twice?
                    // why do we need to create iterable data?

                    _maasData = response;
                    var createIterableData = function(monitorData){

                        var iterable = [];
                        var pingUsed = false;
                        if(monitorData.events){
                            mdp.transformEventData(monitorData);
                        }
                        $.each(monitorData, function(type, m){
                            if (m.length === 0){return;}
                            var mon = {};
                            if (type === 'ping'){

                                if(m.ping && m.ping.name){
                                    pingUsed = true;
                                    mon = m.ping;
                                    getAction(mon);
                                    iterable.push(mon);
                                }

                            }
                            else if (type === 'http' || type === 'https'){
                                $.each(m, function(name, mon){

                                    if(mon.template === 'http' || mon.template === 'https'){

                                        getAction(mon);
                                        iterable.push(mon);
                                    }

                                });
                            }
                        });
                        function getAction(mon){
                            try {
                                var tx = mon.ticketOptions;
                                mon.action = typeof tx === 'object' &&
                                    tx.primary_contact &&
                                    tx.primary_contact.phone.length > 1 ?
                                    'ticket' : 'email';
                            } catch(er){
                                mon.action = 'email';
                            }
                        }
                        return {
                            iterable:iterable,
                            pingUsed:pingUsed
                        };
                    };
                    $.each(_maasData, function(i,item){
                        var iter = createIterableData(this.monitors);
                        item.monitors = iter.iterable;
                        item.pingUsed = iter.pingUsed;

                    });

                    if (instances){
                        $.each(instances, injectMaasData);
                    }
                    deferred.resolve(_maasData);
                });
            return deferred.promise;
        }

        var injectMaasData = function(i, instance){

            var monitorData = _.find(_maasData, { instance_id:instance.platformId });

            if(monitorData && monitorData.monitored){

                monitorData.eventCount = 0;
                var monitoringEnabled = false;

                $.each(monitorData.monitors, function(m, mon){

                    if(mon.state === 'enabled'){
                        monitoringEnabled = true;
                    }
                    mon.status = 'ready';
                });

                if(monitoringEnabled){

                    monitorData.status = 'active_no_events';

                    $.each(monitorData.monitors, function(k, myMon){

                        myMon.status = 'active_no_events';

                        if(monitorData.events){

                            $.each(monitorData.events, function(e, event){

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

                                if(myMon.name === eventType){

                                    monitorData.eventCount += this.count;
                                    myMon.status = 'active_events';
                                    monitorData.status = 'active_events';
                                }
                            });
                        }

                    });

                }
                else {
                    monitorData.status = 'ready';
                }

            } else {
                monitorData = { status: 'inactive'};
            }

            instance.monitorData = monitorData;
        };

        function _showMonitorStatus(status, msg){

            if(status === msg){
                return true;
            } else {
                return false;
            }
        }

        function _getMaasByInstance(platformId, instances){

            var deferred = $q.defer();

            _getMaasData(instances).then(function(){
                deferred.resolve(_.find(_maasData, { instance_id: platformId }));
            });

            return deferred.promise;
        }


        return api;

    }
]);