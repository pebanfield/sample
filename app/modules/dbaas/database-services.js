angular.module('cloudweb.database')
  .factory('PlanService',
    [          '$http',
      function( $http ) {
        var url = '/database/plans'
        return {
          getPlans: function() {
            return $http.get(url).then(function(res) {
              return res.data
            })
          },
          getPlanGroups: function(planId) {
            var uri = url + '/' + planId + '/groups'
            return $http.get(uri).then(function(res) {
              return res.data
            })
          }
        }

      }
    ]
  )

  .factory('DatabaseService',
    [          '$http',
      function( $http ) {
        var url = '/database/'

        return {
          create: function(database) {
            return $http.put(url + database.name, database)
          },

          delete: function(database) {
            // $http doesn't send http-body using $http.delete
            return $http.post(url + database.Name, { database: database })
          }
        }

      }
    ]
  )

  .service('ConfirmService',
    [           '$modal', '$sce',
      function ( $modal ,  $sce ) {

        var defaults = {
          backdrop: true,
          keyboard: true,
          modalFade: true,
          templateUrl: '/modules/dbaas/confirm.html'
        }

        var options = {
          title: 'Please Confirm',
          warning: true,
          message: '&lt;Replace me with a better message&gt;',
          checkToSubmit: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Confirm'
        }

        this.showModal = function(customDefaults, customOptions) {
          if (!customDefaults) { customDefaults = {} }
          customDefaults.backdrop = 'static'
          return this.show(customDefaults, customOptions)
        }

        this.show = function(customDefaults, customOptions) {
          var tmpDefaults = {};
          var tmpOptions = {};

          angular.extend(tmpDefaults, defaults, customDefaults)
          angular.extend(tmpOptions,  options,  customOptions)

          tmpOptions.message = $sce.trustAsHtml(tmpOptions.message)

          if (!tmpDefaults.controller) {
            tmpDefaults.controller = function ($scope, $modalInstance) {
              $scope.options = tmpOptions

              $scope.options.cancel = function (result) {
                $modalInstance.dismiss('cancel')
              }

              $scope.options.confirm = function (result) {
                $modalInstance.close(result)
              }
            }
          }
          return $modal.open(tmpDefaults).result
        }
      }
    ]
  )

