(function () {
  'use strict';
  // Declare app level module which depends on filters, and services
  angular.module('cloudweb',
    ['ngAnimate',
     'mgcrea.ngStrap',
     'ui.bootstrap',
     'ui.router',
     'csf', //TODO - create logical submodules, e.g., csf.directives
     'csf.filters',
     'csf.services',
     'csf.loader',
     'cloudweb.compute',
     'cloudweb.database'
   ])
   .config(
     [        '$httpProvider', '$stateProvider', '$urlRouterProvider',
     function ($httpProvider,   $stateProvider,   $urlRouterProvider) {

       $urlRouterProvider.otherwise('/compute');

       var logoutUnauthorizedUser = function($rootScope, $location, $q) {
         var success = function(response) {
           return response;
         }
         var error = function(response) {
           if (response.status == 401) {
             $location.path('/logout');
           }
           return $q.reject(response);
         }
         return function(promise) {
           return promise.then(success, error);
         }
       }
       $httpProvider.responseInterceptors.push(logoutUnauthorizedUser);
     }
   ])

   .run(function ($rootScope, $location, $state, $stateParams, $exceptionHandler, AppData) {
     $rootScope.spinner = 'show'
     $rootScope.$state = $state;
     $rootScope.$stateParams = $stateParams;
     $rootScope.alerts = []
     $rootScope.exceptionHandler = $exceptionHandler;
     AppData.init();
     AppData.parseUserPreferences();


     $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
       $rootScope.spinner="show"
       //console.log('state change start from(' + fromState.name + ')')
     })

     $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
       $rootScope.spinner="hide"
       //console.log('state change success to(' + toState.name + ')')
     })
   });

}());

