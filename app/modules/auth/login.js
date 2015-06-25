/**
 * Created with JetBrains WebStorm.
 * User: pbanfield
 * Date: 8/24/13
 * Time: 9:55 AM
 *
 * login.js - LoginCtrl logic includes angular-bootstrap
 * form login and validation. This controller also stores
 * a token in the session cookie.
 *
 */

/* global angular, $, console */
(function () {

'use strict';
angular.module('auth').
  controller('LoginCtrl',
    [        '$scope', 'AppData', '$http', '$location',
    function ($scope,   AppData,   $http,   $location) {

      var serviceUrl = '/cloudapi/authorization/v1/tokens';
      $scope.requesting = false;

      $scope.login = function () {

        if ($scope.requesting){//prevent double calls
          return;
        }
        $scope.requesting = true;
        var requestBody = {
          credentials: {
            username: $scope.session.username  || $('input[name=username]').val(),
            password: $scope.session.password  || $('input[name=password]').val()
          }
        };
        var requestPath = $location.path();
        $http({
          url: serviceUrl,
          method: "POST",
          data: requestBody,
          headers: {'Content-Type': 'application/json', 'Request-Path': requestPath}
        }).success(function (data, status, headers, config) {
          window.location.href = "/";
        }).error(function (data, status, headers, config) {
          $scope.status = status;
          $scope.requesting = false;

        });

      };

    }]);

}());
