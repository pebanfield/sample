angular.module('cloudweb')
.directive('csfSlidemenu',
            ['$location', 'ConfigurationService',
   function ( $location,   ConfigurationService) {
     return {
       restrict: 'A',
       templateUrl: 'components/slide-menu-directive/slidemenu.html',
       link: function (scope, elem, attrs) {
           scope.items = ConfigurationService.menu.items;
       }
     }
   }]);
