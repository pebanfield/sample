angular.module('cloudweb')
    .directive('csfInstanceLarge', ['$location', '$modal', function ($location, $modal) {

        return {
            restrict: 'A',
            templateUrl: 'modules/compute/views/resources/templates/instancelarge.html',
            link: function (scope, elem, attrs) {

                var config = JSON.parse(attrs.ngConfig);
                scope.resource = config;
                scope.suspendResumeText = 'suspend';

            }
        }
    }]);

