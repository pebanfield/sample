/**
 * Created by pbanfield on 12/9/13.
 */

angular.module('cloudweb').directive('focus', ['$timeout', function ($timeout) {
    return function (scope, element, attrs) {
        attrs.$observe('focus', function (newValue) {
            $timeout(function () {
                newValue === 'true' && element[0].focus();
            });
        });
    }
}]);