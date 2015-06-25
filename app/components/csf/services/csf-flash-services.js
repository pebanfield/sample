
angular.module('csf.flash.services', [
  'ui.bootstrap.alert'
])

  .factory('FlashService',
    [          '$rootScope', '$timeout',
      function ($rootScope,   $timeout) {

        var FLASH_DURATION = 6000

        var popper = function () {
          if ($rootScope.alerts.length == 1) {
            $rootScope.alerts.pop()
          }
        }

        return {
          danger: function(message) {
            this.clear()
            $rootScope.alerts.push({ type: 'danger', msg: message })
            window.scrollTo(0,0)
          },

          success: function(message) {
            if ($rootScope.alerts.length > 0) return
            $rootScope.alerts.push({ type: 'success', msg: message })
            $timeout(popper, FLASH_DURATION)
          },

          info: function(message) {
            if ($rootScope.alerts.length > 0) return
            $rootScope.alerts.push({ msg: message })
            $timeout(popper, FLASH_DURATION)
          },

          clear: function(index) {
            $rootScope.alerts = []
          }
        }
      }
    ]
  )

