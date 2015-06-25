/**
 * Created by pbanfield on 11/28/13.
 */

/* global angular, console, _, $ */

(function () {

    'use strict';

    var services = angular.module('csf.services');
    services.factory('MonitoringDataParser', ['DNSService', function(DNSService) {

        var api = {
            transformEventData: _transformEventData,
            getGraphDateParams: _getGraphDateParams
        };

        function _updateMonitorStatus(id){

            $.each(instances, function(i, instance){
                if(instance.platformId === id){
                    injectMaasData(0, instance);
                }
            });
        }

        function _transformEventData(monitor){

            $.each(monitor.events, function(index, event){
                if(event.eventClass.text === '/Status/Web'){
                    event.type = monitor.type;
                } else if(event.eventClass.text === '/Status/Ping'){
                    event.type = monitor.type;
                }

            });
        }

        function _getGraphDateParams(opts){

            if (opts && opts.custom){
                //console.log(opts);
                var now = new Date();
                var secFrom = (opts.to.valueOf() - opts.from.valueOf()) / 1000;
                var secTo = (now.valueOf() - opts.to.valueOf()) / 1000;
                return '&start=end-' + secFrom + 's&end=now-' + secTo + 's';
            }
            var secs;
            if (!opts || opts.day){
                secs = 86400;
            } else if (opts.hour){
                secs = 3600;
            } else if (opts.week){
                secs = 604800;
            }
            return '&start=end-' + secs + 's&end=now-0s';
        };

        return api;

    }]);

}());
