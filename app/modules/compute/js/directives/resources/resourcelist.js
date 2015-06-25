angular.module('cloudweb')
    .directive('csfResourcelist', ['AppData', 'InstanceDataProvider', '$location', function ($location) {
        return {
            restrict: 'A',
            templateUrl: 'modules/compute/views/resources/templates/resourcelist.html',
            link: function (scope, elem, attrs) {

                var config = JSON.parse(attrs.ngConfig);

            }
        }
    }]);

