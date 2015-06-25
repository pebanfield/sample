/**
 * Created with JetBrains WebStorm.
 * User: pbanfield
 * Date: 9/9/13
 */

/* global angular, console, $ */

/*
  TODO - Where do we get this data from? The build system, static file, cloudweb end point?
 */

(function () {

    'use strict';

    var services = angular.module('csf.services');

    services.factory('ConfigurationService', ['MENU',function(MENU) {

        return {
            menu: MENU
        };

    }]);

}());

