angular.module('cloudweb')
  .controller('DNSFlyout',
    [       '$scope', 'DNSService', '$rootScope', '$modal', '$q', '$timeout',
    function($scope,   DNSService,   $rootScope,   $modal,   $q,   $timeout) {
        //'use strict';

        //var modalScope = $rootScope.$new();

        //var addModal,
            //deleteModal,
            //deleteModalPromise = $modal({
                //template: 'modules/odh/views/modals/deletednsconfirm.html',
                //persist: true,
                //show: false,
                //backdrop: 'static',
                //scope: modalScope
            //}),
            //addModalPromise = $modal({
                //template: 'modules/odh/views/modals/addupdatedns.html',
                //persist: true,
                //show: false,
                //backdrop: 'static',
                //scope: modalScope
            //});

        //modalScope.PrivateDNSSuffix = 'cloud.corp.dig.com';
        //modalScope.PublicDNSSuffix = 'cloud.go.com';
        //modalScope.newRecord = '';
        //modalScope.inputStatus = '';
        //modalScope.flyoutStatus = '';
        //modalScope.updateMode = false;

        //var bindFlyoutData = function(name){

            //if($scope.instance.dnsRecords && $scope.instance.dnsRecords.length > 0){
                //resetRadioButtonState(name);
                //$scope.dnsRecords = $scope.instance.dnsRecords;
            //}
        //};

        //var resetRadioButtonState = function(name){
            //if (name || ($scope.instance.dnsRecords && $scope.instance.dnsRecords.length > 0)){
                //$scope.instance.selectedRecord = name || $scope.instance.dnsRecords[0].name;
            //}

        //};

//[>
        //$scope.$on("popover-show", function(evt){

            //console.log("dns pop up");

        //});
//*/

        //$scope.$watch('instance.dnsRecords', bindFlyoutData);
        //$scope.$watch('instance.vip.dnsRecords', bindFlyoutData);

        //modalScope.testRecord = function(){
            //modalScope.inputStatus = 'checking';
            //var availabilityResult = function(response){
                //modalScope.inputStatus = response;
            //};
            //DNSService.testAvailability(modalScope.newRecord, modalScope.PrivateDNSSuffix, availabilityResult);
        //};

        //// callback used from addRecord and updateRecord to pass to dns service
        //var addRecordResult = function(response){
            //if (response){
                //$scope.$parent.immediateUpdate(function(){
                    //addModal.modal('hide');
                    //setTempStatus('addedSuccessfully', 2500);
                //});
            //}
        //};

        //$scope.setSelectedRecord = function(name){

            //$scope.instance.selectedRecord = name;
            //modalScope.selectedRecord = name;
        //};

        //$scope.setInstanceData = function(isVip){

            //if(isVip){
                //$scope.dnsRecords = $scope.instance.vip.dnsRecords;
                //$scope.ip = $scope.instance.vip.publicIp;
                //$scope.DNSSuffix = 'cloud.go.com';
                //modalScope.DNSSuffix = 'cloud.go.com';

            //} else {
                //$scope.dnsRecords = $scope.instance.dnsRecords;
                //$scope.ip = $scope.instance.ip;
                //$scope.DNSSuffix = 'cloud.corp.dig.com';
                //modalScope.DNSSuffix = 'cloud.corp.dig.com';
            //}
            //$scope.instance.selectedRecord = $scope.dnsRecords[0].name;
        //};

        //modalScope.addRecord = function(){

            //DNSService.addRecord(
                //modalScope.newRecord,
                //$scope.DNSSuffix,
                //$scope.ip,
                //addRecordResult
            //);
        //};

        //modalScope.updateRecord = function(){
            //modalScope.inputStatus = 'deleting';

            //DNSService.deleteRecord(
                //$scope.instance.selectedRecord,
                //$scope.DNSSuffix,
                //$scope.instance.ip,
                //function(response){
                    //if (response){
                        //modalScope.inputStatus = 'adding';
                        //DNSService.addRecord(
                            //modalScope.newRecord,
                            //modalScope.PrivateDNSSuffix,
                            //$scope.ip,
                            //addRecordResult
                        //);
                    //} else {
                        //modalScope.inputStatus = 'deletefail';
                    //}
                //}
            //);
        //};

        //modalScope.deleteRecord = function(){
            //modalScope.deletedRecord = $scope.instance.selectedRecord;
            //var deleteRecordResult = function(response){
                //if(response){

                    //$scope.$parent.immediateUpdate(function(){
                        //deleteModal.modal('hide');
                        //setTempStatus('deletedSuccessfully', 2500);
                    //});

                //}
            //};

            //DNSService.deleteRecord(
                //$scope.instance.selectedRecord,
                //modalScope.DNSSuffix,
                //$scope.instance.ip,
                //deleteRecordResult
            //);
        //};

        //$scope.addRecordModal = function() {
            //modalScope.inputStatus = '';
            //modalScope.newRecord = '';
            //modalScope.updateMode = false;
            //$q.when(addModalPromise).then(function(modalEl) {
                //addModal = modalEl;
                //$scope.hide();
                //addModal.modal('show');
            //});
        //};

        //$scope.updateRecordModal = function() {
            //modalScope.inputStatus = '';
            //modalScope.newRecord = '';
            //modalScope.updateMode = true;
            //$q.when(addModalPromise).then(function(modalEl) {
                //addModal = modalEl;
                //$scope.hide();
                //addModal.modal('show');
            //});
        //};

        //$scope.confirmDeleteModal = function() {
            //$q.when(deleteModalPromise).then(function(modalEl) {
                //deleteModal = modalEl;
                //$scope.hide();
                //deleteModal.modal('show');
            //});
        //};

        //// sets a temporary status message on the flyout
        //var setTempStatus = function(status, timeout){
            //$scope.flyoutStatus = status;
            //$timeout(function(){
                //$scope.flyoutStatus = '';
            //}, timeout);
        //};
    }
]);
