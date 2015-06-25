/**
 * Created by pbanfield on 2/10/14.
 *
 * The client storage service abstracts cookie and storage management
 * to allow for mock dependency injection in test specs.
 */

(function () {

    'use strict';

    var services = angular.module('csf.services');

    services.factory('ClientStorage', function() {

        var _getCookie = function(name){
            return $.cookie(name);
        };

        var _setCookie = function(name, val){
            $.cookie(name, val);
        };

        var _storeLocal = function(name, val){

            if(typeof(Storage)!=="undefined")
            {
                localStorage.setItem(name, val);
            }
            else
            {
                // Sorry! No Web Storage support..
                console.log("Warning : No Web Storage Support");
            }
        };

        var _getLocal = function(name){
            return localStorage.getItem(name);
        };

        return {
            getCookie: _getCookie,
            setCookie: _setCookie,
            storeLocal: _storeLocal,
            getLocal: _getLocal
        };
    });

}());

