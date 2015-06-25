/**
 * Created by pbanfield on 9/10/14.
 */
/**
 *
 * A data proxy for retrieving cloud api compute data.
 */

/* global angular, console, _, $ */

angular.module('csf.services').factory('IdentityService', [
    '$q',
    '$http',
    'AppData',
    'InstanceDataProvider',
    function($q, $http, AppData, InstanceDataProvider) {

        'use strict';

        var api = {
            getUserByName: _getUserByName,
            checkUserRegistration: _checkUserRegistration,
            registerUser: _registerUser,
            authenticateUser: _authenticateUser
        };

        function _authenticateUser(username, password){

            var deferred = $q.defer();

            var requestBody = {
                credentials: {
                    username: username,
                    password: password
                }
            };

            $http({
                url: '/cloudapi/authorization/v1/tokens',
                method: "POST",
                data: requestBody,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                deferred.resolve({"data": data, "httpCode": status});
            }).error(function (data, status, headers, config) {
                deferred.reject({"data": data, "httpCode": status});
            });

            return deferred.promise;
        }

        function _getUserByName(name){

            var deferred = $q.defer();
            $http({
                method:'GET',
                url:'/cloudapi/compute/v1/users/?name='+name,
                headers: {'Content-Type': 'application/json',
                    'Authorization': AppData.getToken()},
                cache: false
            }).success(function(data, status){

                deferred.resolve({userdata: data, httpcode: status});
            }).error(function(data, status, headers, config) {
                deferred.reject({userdata: data, httpcode: status});
            });

            return deferred.promise;
        }

        function _checkUserRegistration(){

            var deferred = $q.defer();

            //check for test & registered users with zones
            InstanceDataProvider.getZones().then(function(result){

                //test or registered users with zones
                if(result.zones.length > 0) {
                    deferred.resolve(true);
                } else {

                    AppData.getUserData().then(function(result){

                        var username = result.data.token.username;
                        var email = result.data.token.email;

                        //is this user registered with Compute OpenStack?
                        _getUserByName(username).then(function(result){

                            if(result.httpcode === 200){
                                deferred.resolve(true);
                            }

                        }, function(error){

                            if(error.httpcode === 404){
                                _registerUser(username, email).then(function(result){
                                    deferred.resolve(true);
                                }, function(error){
                                    console.log('Registration Error : ' + error);
                                    deferred.resolve(false);
                                });
                            }

                        });
                    });
                }

            });

            return deferred.promise;
        }

        function _registerUser(username, email){

            var deferred = $q.defer();

            var postData = {};
            postData.credentials = {};
            postData.credentials.username = username;
            postData.credentials.email = email;

            $http({
                method:'POST',
                url:'/cloudapi/compute/v1/register',
                data: JSON.stringify(postData),
                headers: {'Content-Type': 'application/json',
                    'Authorization': AppData.getToken()},
                cache: false
            }).success(function(data, status){

                deferred.resolve({userdata: data, httpcode: status});
            }).error(function(data, status, headers, config) {
                deferred.reject({userdata: data, httpcode: status});
            });

            return deferred.promise;
        }

        return api;
    }
]);



