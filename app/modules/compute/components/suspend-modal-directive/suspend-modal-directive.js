angular.module('cloudweb')
.controller('suspendModalInstanceCtrl',
  [       '$scope', '$modalInstance',
  function($scope,   $modalInstance){
    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    }
    $scope.suspend = function(){
      $modalInstance.close(this.suspendReminderToggle) //TODO: this not bound to scope? wat
    }
}])

.controller('suspendModalCtrl',
  [       '$scope', '$modal', 'AppData', 'ServerActions',
  function($scope,   $modal,   AppData,   ServerActions){

  $scope.suspendReminderToggle = AppData.getSuspendWarningToggle();

  $scope.suspendInstance = function (resource) {
    ServerActions.suspendVM(resource.zoneId, resource.id).then(function(result){
        //TODO: add timeout loop to wait for suspending
        $scope.resource.status = 'SUSPENDING'
      }
    );
  }

  $scope.resumeInstance = function(resource) {
    ServerActions.resumeVM(resource.zoneId, resource.id)
    .then(function(result){
       //TODO: add timeout loop to wait for RESUMING
      $scope.resource.status = 'RESUMING';
    });
  }

  var modalOptions = {
    templateUrl: 'modules/compute/components/suspend-modal-directive/suspend-modal.html',
    controller: 'suspendModalInstanceCtrl',
    scope: $scope,
    size: 'md'
  }

  $scope.openModal = function(){
    var modalInstance = $modal.open(modalOptions);
    modalInstance.result.then(function(suspendReminderToggle){
      $scope.suspendInstance($scope.resource)
      $scope.suspendReminderToggle = suspendReminderToggle;
    });
  }

  $scope.$watch('suspendReminderToggle', function(newVal, OldVal){
    AppData.setSuspendWarningToggle(newVal)
  })
}])

.directive('csfSuspendModal', [function () {
  return {
    restrict: 'A',
    controller: 'suspendModalCtrl',
    scope: {
      resource: '='
    },
    link: function (scope, elem, attrs) {
      elem.bind('click', function(){
        //TODO: SUSPENDING AND RESUMING STATUS HANDLING
        if(scope.resource.status == 'SUSPENDED'){
          scope.resumeInstance(scope.resource)
        }else if(scope.resource.status == 'ACTIVE'){
          if(scope.suspendReminderToggle) {
            scope.suspendInstance(scope.resource)
          }else{
            scope.openModal()
          }
        }
      })
    }
  }
}]);

