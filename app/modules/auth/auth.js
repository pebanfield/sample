/**
 * Created with JetBrains WebStorm.
 * User: pbanfield
 * Date: 8/28/13
 * Time: 3:07 PM
 *
 * auth.js - authentication application entry point
 *
 * This light weight angular app performs cookie management,
 * token validation and login authentication.
 *
 * Once a user has been authenticated this application is no
 * longer used and the main application is loaded.
 *
 */

/* global angular */
(function () {

    'use strict';

    var rcSubmitDirective = {
        'rcSubmit': ['$parse', function ($parse) {
            return {
                restrict: 'A',
                require: 'form',
                link: function (scope, formElement, attributes, formController) {

                    var fn = $parse(attributes.rcSubmit);

                    formElement.bind('submit', function (event) {
                        // if form is not valid cancel it.
                        if (!formController.$valid) return false;

                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                }
            };
        }]
    };

// define attempt directive
    var rcAttemptDirective = {
        'rcAttempt': function () {
            return {
                restrict: 'A',
                controller: ['$scope', function ($scope) {
                    this.attempted = false;

                    var attemptHandlers = [];

                    this.onAttempt = function(handler) {
                        attemptHandlers.push(handler);
                    };

                    this.setAttempted = function() {
                        this.attempted = true;

                        angular.forEach(attemptHandlers, function (handler) {
                            handler();
                        });
                    };
                }],
                compile: function(cElement, cAttributes, transclude) {
                    return {
                        pre: function(scope, formElement, attributes, attemptController) {
                            scope.rc = scope.rc || {};
                            scope.rc[attributes.name] = attemptController;
                        },
                        post: function(scope, formElement, attributes, attemptController) {
                            formElement.bind('submit', function () {
                                attemptController.setAttempted();
                                if (!scope.$$phase) scope.$apply();
                            });
                        }
                    };
                }
            };
        }
    };

    var rcVerifySetDirective = {
        'rcVerifySet': function () {
            return {
                restrict: 'A',
                require: ['^rcAttempt', 'ngModel'],
                link: function (scope, element, attributes, controllers) {
                    var attemptController = controllers[0];
                    var modelController = controllers[1];

                    attemptController.onAttempt(function() {
                        modelController.$setViewValue(element.val());
                    });
                }
            };
        }
    };

    angular.module('rcForm',  ['csf.services'])
    .directive(rcSubmitDirective)
    .directive(rcAttemptDirective);

    angular.module('auth', ['rcForm', 'csf.loader']);

}());
