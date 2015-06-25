/**
 * Created with JetBrains WebStorm.
 * User: pbanfield
 * Date: 9/9/13
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */

/* global angular, $ */

(function () {

    'use strict';

    var services = angular.module('csf.services');

    services.factory('AppData', [ '$rootScope', function($rootScope) {

        var _token = null;
        var _appstore = null;

        var scope = $rootScope.$new();
        scope.appData = scope.appData || {};


        var _isInitialized = false;

        var _parseCookieData = function() {
            //TODO - fix env and suite
            _appstore = $.cookie('appstore');
            _appstore = _appstore.replace('s:j:', "");
            _appstore = _appstore.split('}')[0] + "}}";
            var cookieObj = JSON.parse(_appstore);
            _token = cookieObj.token;
        };

        var _init = function(){

            _parseCookieData();
           _isInitialized = true;
        };

        var _getScope = function(){
                return scope;
            };

        var _getToken = function(){
                _parseCookieData();
                return _token.id;
            };
        var _getUser = function(){
            return _token;
        };


        return {
            isInitialized: _isInitialized,
            init: _init,
            getScope: _getScope,
            getToken: _getToken,
            getUser: _getUser

        };
    }]);

}());

