angular.module('csf.resourceStatusClassToggle', [])
  .directive('resourceStatusClassToggle', [function () {
    return {
      restrict: 'A',
      scope:{ status: '=' },
      link: function(scope, elm, attrs) {
        var e = elm;
        var statusClasses = {
          'ACTIVE'     : 'resource-status-active',
          'BUILD'      : 'resource-status-build',
          'SUSPENDED'  : 'resource-status-suspended',
          'RESTARTING' : 'resource-status-restarting',
          'SUSPENDING' : 'resource-status-suspending',
          'RESUMING'   : 'resource-status-resuming',
          'DELETING'   : 'resource-status-deleting',
          'SHUTOFF'    : 'resource-status-shutoff',
          'ERROR'      : 'resource-status-error',
        };
        scope.$watch('status', function(status){
            if(status){
              angular.forEach(statusClasses, function(value, key){
                elm.toggleClass(value, key == status)
              })
            }
        })
      }
    }
  }]);
