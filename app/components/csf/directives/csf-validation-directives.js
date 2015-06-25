
angular.module('csf.ui.validate', [])

  .directive('csfNumberRequired',
    [
      function () {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attr, ctrl) {
            element.on('input', function(event) {
              ctrl.$setValidity( 'csfNumberRequired', /[0-9]+/.test(event.target.value) )
            })
          }
        }
      }
    ]
  )

  .directive('csfLowerCaseAlphaRequired',
    [
      function () {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attr, ctrl) {
            element.on('input', function(event) {
              ctrl.$setValidity( 'csfLowerCaseAlphaRequired', /[a-z]+/.test(event.target.value) )
            })
          }
        }
      }
    ]
  )

  .directive('csfUpperCaseAlphaRequired',
    [
      function () {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attr, ctrl) {
            element.on('input', function(event) {
              ctrl.$setValidity( 'csfUpperCaseAlphaRequired', /[A-Z]+/.test(event.target.value) )
            })
          }
        }
      }
    ]
  )

  .directive('csfNoRestrictedCharacters',
    [
      function () {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attr, ctrl) {
            element.on('input', function(event) {
              var regex = new RegExp(attr.csfNoRestrictedCharacters)
              ctrl.$setValidity( 'csfNoRestrictedCharacters', !regex.test(event.target.value) )
            })
          }
        }
      }
    ]
  )

  .directive('csfPattern',
    [
      function () {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attr, ctrl) {
            element.on('input', function(event) {
              var regex = new RegExp(attr.csfPattern)
              ctrl.$setValidity( 'csfPattern', regex.test(event.target.value) )
            })
          }
        }
      }
    ]
  )

  .directive('csfMustMatch',
    [
      function () {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attr, ctrl) {

            scope.$watch(attr.ngModel, function() {
              validate()
            })

            attr.$observe('csfMustMatch', function (val) {
              validate()
            })

            var validate = function() {
              var val1 = ctrl.$viewValue
              var val2 = attr.csfMustMatch

              if (val1 && val2) {
                ctrl.$setValidity('csfMustMatch', val1 === val2)
              }
            }
          }
        }
      }
    ]
  )

