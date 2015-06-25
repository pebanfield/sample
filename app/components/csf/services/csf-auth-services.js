
// TODO: This should not use the flash service directly
// the app should handle reporting results back to the user

angular.module('csf.auth.services', [
  'ngSanitize',
  'csf.flash.services'
])

  .factory('SessionService',
    [
      function () {
        return {
          get: function(key) {
            return sessionStorage.getItem(key)
          },
          set: function(key, val) {
            return sessionStorage.setItem(key, val)
          },
          unset: function(key) {
            return sessionStorage.removeItem(key)
          }
        }
      }
    ]
  )

  .factory('AuthenticationService',
    [          '$rootScope', '$http', '$sanitize', 'SessionService', 'FlashService',
      function ($rootScope,   $http,   $sanitize,   SessionService,   FlashService) {

        var saveSession = function() {
          SessionService.set('authenticated', true)
        }

        var dropSession = function() {
          SessionService.unset('authenticated')
        }

        var loginError = function(response) {
          FlashService.danger(response.flash)
        }

        var sanitizeCredentials = function(credentials) {
          return {
            email: $sanitize(credentials.email),
            password: $sanitize(credentials.password)
          }
        }

        return {
          login: function(credentials) {
            var login = $http.post('/account/authenticate', sanitizeCredentials(credentials))
            login.success(saveSession)
            login.success(FlashService.clear)
            login.error(loginError)
            return login
          },
          logout: function() {
            var logout = $http.get('/account/logout')
            logout.success(
              function() {
                $rootScope.navLogout = ''
                $rootScope.navDatabaseList = ''
                dropSession()
              }
            )
            return logout
          },
          isLoggedIn: function() {
            return SessionService.get('authenticated')
          }
        }

      }
    ]
  )


