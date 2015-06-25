angular.module('cloudweb')
    .directive('csfInstanceMedium', ['$location', function ($location) {
        return {
            restrict: 'A',
            templateUrl: 'modules/compute/views/resources/templates/instancemedium.html',
        }
    }]);

