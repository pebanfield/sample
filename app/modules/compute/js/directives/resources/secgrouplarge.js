/**
 * Created by pbanfield on 4/28/14.
 */
angular.module('cloudweb')
    .directive('csfSecgroupLarge', ['$location', function ($location) {

        return {
            restrict: 'A',
            templateUrl: 'modules/compute/views/resources/templates/secgrouplarge.html',
            link: function (scope, elem, attrs) {

                scope.$emit(attrs["onRepeatDone"] || "repeat_done", elem);

                var config = JSON.parse(attrs.ngConfig);
                scope.resource = config;

                if (scope.$last) { // all are rendered

                    scope.$emit("RESOURCES_RENDERED");
                }

            }
        }
    }]);

