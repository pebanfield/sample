
angular.module('csf.data.services', [])


.factory('HttpPollerService',
  [           '$rootScope', '$http', '$timeout',
    function(  $rootScope,   $http,   $timeout ) {



      /**
       *
       * @name validationOption
       *
       * @property {object} options Object literal passed to use by the caller
       * @property {string} option Object literal key name
       *
       * @description
       * Validation method that throws an exception if required
       * options not provided
       *
       */

      function validateOption(options, option) {
        if (!(option in options)) {
          throw Error('Missing required option: \'' + option + '\'')
        }
      }




      var EVENT_PREFIX = 'HttpPollerService:'

      var DEFAULT_REFRESH_INTERVAL = 10000 // 10 seconds

      var HTTP_MAX_FAILURES = 10

      var poller = {}

      poller._httpFailureCount = 0

      poller._httpThrottleRate = 5000 // 5 seconds






      /**
       *
       * @name httpSuccess
       * @requires $http
       *
       * @description
       *
       * Method called upon successful $http request. The method
       * checks for previous failures and increases the refresh
       * interval if required. Then we execute the callback
       * provided by the caller passing it the data returned by
       * the $http request.
       *
       */

      var httpSuccess = function (data, status, headers, config) {
        if (poller._httpFailureCount > 0) {
          poller._httpFailureCount = 0
        }

        // decrease current interval
        if (poller._currentInterval > poller._refreshInterval) {
          poller._currentInterval -= poller._httpThrottleRate


          var message = "Current refresh interval does not match the preestablished refresh " +
                        "interval.\nGradulally descreasing interval to match refresh interval.\n" +
                        "Refresh Interval: " + poller._refreshInterval / 1000 + " seconds\n" +
                        "Current Interval: " + poller._currentInterval / 1000 + " seconds\n"

          poller._log(message)
        }

        poller._callback(data)
        poller._state = "ready"
      }







      /**
       *
       * @name httpError
       * @requires $http
       *
       * @description
       *
       * Method called when $http request failed. Based on the error
       * the refresh interval is increased to prevent continous polling
       * of the http resource. A failure counter is also incremented.
       *
       */

      var httpError = function (data, status, headers, config) {
        if (status == 0 || status >= 500) {
          // increase current interval
          poller._currentInterval += poller._httpThrottleRate
          poller._httpFailureCount++

          var message = "HTTP error detected.\nIncreasing current refresh interval.\n" +
                        "Refresh Interval: " + poller._refreshInterval / 1000 + " seconds\n" +
                        "Current Interval: " + poller._currentInterval / 1000 + " seconds\n"

          poller._log(message)
          poller._state = "ready"
        }
        // TODO: notify caller of error so they can report back
        // if they want. perhaps emit the error
      }







      /**
       *
       * @name _refresh
       * @requires $timeout
       *
       * @description
       *
       * A private method that continously calls itself through a $timeout.
       *
       * The method fist validates that the ui-state is valid and that
       * the poller has not reached the max failed http requests.
       *
       * The method broadcasts an event to the calling scope and passed an
       * $http promise with the event. The method then sets a timeout to
       * call itself.
       *
       */

      poller._refresh = function() {
        var currentState = $rootScope.$state.current.name

        // TODO: this needs to be passed in by the caller
        // or determined through the scope
        if (!/databases.list/.test(currentState)) {
          poller._log('service refresh stopped')
          return
        }

        if (poller._httpFailureCount === HTTP_MAX_FAILURES) {
          poller._log("Reached maximum http errors.\nStopping http poller service.\n")
          return
        }

        if (/ready|initialized/.test(poller._state)) {
          poller._state = "refresh"
          poller._scope.$broadcast(poller._eventName, $http.get(poller._url))
        }

        $timeout(poller._refresh, poller._currentInterval)
      }






      /////////////////////////////////////////////////////////////
      //  Public Methods
      /////////////////////////////////////////////////////////////






      /**
       *
       * @name once
       * @requires $http
       *
       * @property {string} url The url to poll for data
       *
       * @description
       *
       * A simple method that proxies a call to $http.get. This could
       * be used in the `resolve` phase of ui-router to pull data before
       * the state is loaded
       *
       */

      poller.once = function (url) {
        return $http.get(url).then( function (res) { return res.data } )
      }








      /**
       *
       * @name init
       * @requires $http
       * @requires httpSuccess
       * @requires httpError
       *
       * @property {object} options The options required by the service
       *
       * @description
       *
       * A public method that validates options passed by the caller and
       * sets up the service.
       *
       * Especially importants is the $on event listener added the $scope
       * argument passed in by the caller. The listener receives the $http
       * promise that was emitted by the _refresh method. The $http promise
       * is passed the predefined httpSuccess & httpFailure methods
       *
       */

      poller.init = function(options) {
        var self = this

        // validate options

        validateOption(options, 'name')
        validateOption(options, 'url')
        validateOption(options, 'callback')
        validateOption(options, 'scope')

        // check interval

        if (options.interval < 1000) {
          options.interval *= 1000
        }

        self._url = options.url
        self._scope = options.scope
        self._callback = options.callback
        self._refreshInterval = options.interval || DEFAULT_REFRESH_INTERVAL
        self._currentInterval = options.interval
        self._eventName = EVENT_PREFIX + options.name
        self._state = "initialized"

        self._log = function(message) {
          //console.log('HttpPollerService[' + options.name + ']: ' + message)
        }


        // create a listener to catch refresh events

        self._scope.$on(self._eventName,
          function (event, httpPromise) {
            httpPromise
              .success(httpSuccess)
              .error(httpError)
          }
        )

        return poller
      }




      /**
       *
       * @name start
       *
       * @description
       *
       * Simple wrapper to _refresh()
       */

      poller.start = function() {
        this._log('service refresh started')
        this._refresh()
      }



      return poller
    }

  ]
)



