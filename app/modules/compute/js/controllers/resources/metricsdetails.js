/**
 * Created by pbanfield on 11/24/13.
 */

/* global angular, require, console, $, _ */

(function () {

    'use strict';

    angular.module('cloudweb').controller('DeviceMetricsCtrl', [
        '$scope',
        'MonitorsService',
        '$q',
        '$timeout',
        function($scope, MonitorsService, $q, $timeout) {

            $scope.setActiveTab();
            $timeout(function(){
                $scope.isMetricsLoading = true;
            });
            $scope.getInstanceData(false, fetchMetrics);

            function fetchMetrics(){
                $scope.isLoading = false;
                $scope.isMetricsLoading = true;
                MonitorsService.getGraphs($scope.instance.ip, 129600, $scope.instance.platform).then(function(response){
                    $.each(response, function(i, val){
                        if(val.result.success && val.method === 'getGraphDefs'){
                            $scope.graphs = val.result.data;
                            getGraphImages();

                        }
                    });
                });
            }

            var getGraphImages = function(r){
                $scope.isMetricsLoading = true;
                $.each($scope.graphs, function(i, graph){
                    MonitorsService.getImageData(graph.url, r).then(function(result){
                        $scope.isMetricsLoading = false;
                        graph.imgSrc = "data:image/png;base64," + result;
                    });
                });

            };

            var getTimeString = function(date){
                var t  = date.getHours() % 12;
                if (t === 0){ t = 12; }
                t += ':' + date.getMinutes();
                t += date.getHours() > 11 ? 'PM' : 'AM';
            };

            $scope.today = new Date();
            $scope.toDate = new Date();

            $scope.fromDate = new Date($scope.toDate.valueOf() - 86400000);
            $timeout(function(){
                $scope.toTime = getTimeString($scope.toDate);
                $scope.fromTime = getTimeString($scope.fromDate);
            });

            $scope.isMetricsLoading = false;
            $scope.fromDateOpened = false;
            $scope.openPicker = function(lbl) {

                $timeout(function() {
                    $scope.fromDateOpened = lbl === 'from';
                    $scope.toDateOpened = lbl === 'to';
                    $('#'+lbl+'Date').focus();
                });
            };
            $scope.dateOptions = {
                'year-format': "'yy'",
                'starting-day': 1
            };

            $scope.customRange = false;
            $scope.graphRange = function(r){
                //user only clicked custom button, but did not say "get metrics"
                if (r === 'customrange'){
                    $scope.customRange = true;
                    return;
                }

                var rangeOpts = {};
                if (r === 'custom'){
                    var fromDate = $scope.fromDate;
                    if ($scope.fromTime !== ''){
                        fromDate = new Date($scope.fromDate.toLocaleDateString() + ', ' + $scope.fromTime);
                    }
                    var toDate = $scope.toDate;
                    if ($scope.toTime !== ''){
                        toDate = new Date($scope.toDate.toLocaleDateString() + ', ' + $scope.toTime);
                    }
                    getGraphImages({
                        custom:true,
                        from:fromDate,
                        to:toDate
                    });
                }
                else{
                    $scope.customRange = false;
                    rangeOpts[r] = true;
                    getGraphImages(rangeOpts);
                }
            };

        }]
    );

}());
