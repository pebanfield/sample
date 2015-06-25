'use strict';

/* filters */

angular.module('csf.filters', []).
    filter('interpolate', ['version', function (version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }]);