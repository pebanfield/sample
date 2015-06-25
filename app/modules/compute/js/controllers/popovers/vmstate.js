angular.module('cloudweb')
  .controller('VMState',
    [        '$scope', '$rootScope', 'ServerActions', '$modal', '$q',
    function ($scope,   $rootScope,   ServerActions,   $modal,   $q) {
      'use strict';

        //var modalScope = $rootScope.$new();

        //var deleteModal,
            //deleteModalPromise = $modal({
                //template: 'modules/odh/views/modals/deleteconfirm.html',
                //persist: true,
                //show: false,
                //backdrop: 'static',
                //scope: modalScope
            //});
        //$scope.deleteConfirm = function() {
            //$q.when(deleteModalPromise).then(function(modalEl) {

                //deleteModal = modalEl;
                //$scope.hide();
                //$scope.deleteConfirm = false;
                //deleteModal.modal('show');
            //});
        //};

        //$scope.progressBarPct = 0;

        //modalScope.deleteVM = function(){

            //$scope.instance.status = 'DELETING';
            //$scope.requestPending = true;

            //ServerActions.deleteVM($scope.instance.zoneId, $scope.instance.id)
                //.then(function(result){
                    //if (result.status > 199 && result.status < 210){
                        //$scope.$parent.immediateUpdate();
                        //$scope.requestPending = false;
                    //}
                    //else{
                        //console.log(result);
                        //$scope.instance.status = 'ERROR';
                        ////todo: throw error
                    //}
                    //deleteModal.modal('hide');
                //});
        //};
        //$scope.suspendVM = function(){
            //ServerActions.suspendVM($scope.instance.zoneId, $scope.instance.id)
                //.then(function(result){
                    //$scope.instance.status = 'SUSPENDING';
                    //$scope.progressBarPct = 0;
                    //showProgress(50);
                //});
        //};
        //$scope.resumeVM = function(){
            //ServerActions.resumeVM($scope.instance.zoneId, $scope.instance.id)
                //.then(function(result){
                    //$scope.instance.status = 'RESUMING';
                    //$scope.progressBarPct = 0;
                    //showProgress(50);
                //});
        //};

        //var showProgress = function(interval){
            //var progTimer = setInterval(function(){
                //if ($scope.progressBarPct === 100){
                    //clearInterval(progTimer);
                //}
                //$scope.progressBarPct++;
                //try{$scope.$digest();}catch(ex){}
            //}, interval);
        //};


    }]
);
