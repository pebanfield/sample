angular.module('cloudweb.database', [
   //'csf.auth.services',
   'csf.flash.services',
   'csf.data.services',
   'ui.select2',
   'ui.router',
   'ui.bootstrap'
])

.config(
  [           '$stateProvider',
    function ( $stateProvider) {

      $stateProvider
        .state('databases', {
          abstract: true,
          url: '/databases',
          templateUrl: 'modules/dbaas/database.html'
        })
        .state('databases.list', {
          url: '',
          templateUrl: 'modules/dbaas/list.html',
          controller: 'ListDatabasesCtrl',
          resolve: {
            databases: [ 'HttpPollerService',
              function (  HttpPollerService ) {
                return HttpPollerService.once('/database')
              }
            ]
          }
        })
        .state('databases.create', {
          url: '/create',
          templateUrl: 'modules/dbaas/create.html',
          controller: 'CreateDatabaseCtrl',
          resolve: {
            plans: [    'PlanService',
              function ( PlanService ) {
                return PlanService.getPlans()
                .then(
                  function(data) {
                    return _.map(data, function(o) {
                      return { name: o.DisplayName, value: o.Id } }
                    )
                  }
                )
              }
            ]
          }
        })
    }
  ]
)

.controller('ListDatabasesCtrl',
  [         '$rootScope', '$scope', 'databases', 'ConfirmService', 'DatabaseService', 'FlashService', 'HttpPollerService',
    function($rootScope,   $scope,   databases,   ConfirmService,   DatabaseService,   FlashService,   HttpPollerService) {

      $scope.databases = databases

      // refresh database list every 5 seconds

      var httpPollerOptions = {
        name: 'DatabaseList',
        url: '/database',
        scope: $scope,
        interval: 5,
        callback: function (list) {
          //console.log('callback executed')
          $scope.databases = list
        }
      }

      HttpPollerService.init(httpPollerOptions).start()


      $scope.toggleInfo = function ($index) {
        $scope.infoPosition = $scope.infoPosition == $index ? -1 : $index;
      }

      $scope.deleteDatabase = function(database) {
        var message = '<br />All data contained in the database will be deleted.' +
                      '<br />Are you sure you want to proceed?'

        var modalOptions = {
          confirmButtonText: 'Delete',
          message: message,
          warning: true,
          checkToSubmit: true
        }

        ConfirmService.showModal({}, modalOptions)
        .then(
          function (result) {
            $rootScope.spinner = "show"

            DatabaseService.delete(database)
            .success(function(data, status, headers, config) {
              $rootScope.spinner = "hide"
              FlashService.success(data.flash)
              $scope.$state.go('databases.list')
            })
            .error(function(data, status, headers, config) {
              $rootScope.spinner = "hide"
              FlashService.danger(data.flash)
            })

          },
          function (error) {
            // cancel delete
          }
        )
      }

    }
  ]
)

.controller('CreateDatabaseCtrl',
  [         '$rootScope', 'plans', '$scope', '$location', '$timeout', 'PlanService', 'FlashService', 'DatabaseService',
    function($rootScope,   plans,   $scope,   $location,   $timeout,   PlanService,   FlashService,   DatabaseService) {

      $scope.database = {
        taxonomy: '',
            plan: '',
           group: '',
            name: '',
           admin: '',
        password: ''
      }

      $scope.accountId = $rootScope.accountId
      $scope.plans = plans
      $scope.groups = null

      $scope.$watch('database.plan', function(planId) {
        if (planId) {
          $rootScope.spinner = "show"
          PlanService.getPlanGroups(planId)
          .then( function(data) {
            $scope.groups = data
            $rootScope.spinner = "hide"
          })
        }
      })

      $scope.select2Options = {
        minimumIputLength: 2,
        ajax: {
          url: "/taxonomy",
          dataType: 'json',
          data: function (term) {
            return { name: term }
          },
          results: function(data, page) {
            return data
          }
        },
        initSelection: function( element, callback ) {
          callback( { id: element.val(), text: element.val() } )
        }
      }

      $scope.createDatabase = function() {
        FlashService.clear()
        $rootScope.spinner = "show"
        DatabaseService.create($scope.database)
        .success(function(data, status, headers, config) {
          $rootScope.spinner = "hide"
          FlashService.success(data.flash)
          $timeout( function() { $scope.$state.go('databases.list') }, 2000 )
        })
        .error(function(data, status, headers, config) {
          $rootScope.spinner = "hide"
          FlashService.danger(data.flash)
        })
      }
    }
  ]
)





