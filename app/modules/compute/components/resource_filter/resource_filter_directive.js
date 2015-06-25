angular.module('cloudweb.compute')
  .directive('cloudwebResourceFilter', [function () {
    return {
      restrict: 'EA',
      templateUrl: 'modules/compute/components/resource_filter/resource_filter.html',
    }
  }]);
