(function () {

    'use strict';

    var services = angular.module('csf.services');

    services.factory('AppData', ['$rootScope', 'ClientStorage', '$http', '$q', function($rootScope, ClientStorage, $http, $q) {

        var _isInitialized = false;

        var _token = null;
        var _appstore = null;

        var _lastZoneId;
        var _lastZoneName;

        //var _userzone = {id: 'userzone', name: 'user', isSelected: true};
        //TODO - remove temp flag and improve logic
        var _userZoneLoaded = false;

        //store for inactive resources
        var _resources = [];

        var scope = $rootScope.$new();
        scope.appData = scope.appData || {};

        var _userPrefsKey;
        var _userPrefs = {
            lastZone: {id: _lastZoneId, name: _lastZoneName},
            zones: [],
            resources: _resources,
            viewstate: {'resources': {'size': 'large'}}
        };
        var _userData = null;

        var _parseCookieData = function() {

            try {
                _appstore = ClientStorage.getCookie('appstore');

                if(_appstore !== 'test'){
                    _appstore = _appstore.replace('s:j:', "");
                    _appstore = _appstore.split('}')[0] + "}}";
                    var cookieObj = JSON.parse(_appstore);
                    _token = cookieObj.token;
                }

            } catch(err) {
                console.log("Error : Problem with cookie - " + err);
                location.href = '/logout';
            }

        };

        var _storeUserPreferences = function(){

            var str = JSON.stringify(_userPrefs);
              if(_userPrefsKey && str){
                  ClientStorage.storeLocal(_userPrefsKey, str);
              } else {
                  throw new Error('Error : Invalid User Preferences data.');
              }

        };

        var _init = function(){

            if(!_isInitialized){
                _parseCookieData();
                _isInitialized = true;
            }
        };

        var _getScope = function(){
            return scope;
        };

        var _getToken = function(){
            _parseCookieData();
            return _token.id;
        };

        var _getUser = function(){
            return _token;
        };

        var _setLastZone = function(zoneObj){

            _userPrefs.lastZone.id = zoneObj.id;
            _userPrefs.lastZone.name = zoneObj.name;
            _storeUserPreferences();
        };

        var _getLastZone = function(){

            var userPrefs = ClientStorage.getLocal(_userPrefsKey);
            userPrefs = JSON.parse(userPrefs);

            if(userPrefs && userPrefs.lastZone){
                return userPrefs.lastZone;
            } else {
                return null;
            }

        };

        var _getSelectedZoneIds = function(){

            var selectedZoneIds = [];
            for(var s=0; s<_userPrefs.zones.length; s++){
                var zone = _userPrefs.zones[s];
                if(zone.isSelected){
                    selectedZoneIds.push(zone.id);
                }
            }
            return selectedZoneIds;
        };

        var _getSelectedRemotes = function(){

            var selectedZones = [];
            for(var s=0; s<_userPrefs.zones.length; s++){
                var zone = _userPrefs.zones[s];
                if(zone.isSelected){
                    selectedZones.push(zone);
                }
            }
            return selectedZones;
        };

        //check for new zones
        //add selected data from local storage


        //update zones data with new cloud api resource data
        //TODO - add locally stored inactive resource data
        var _updateZones = function(zones){

            for(var z=0; z<zones.length; z++){

                var zone = zones[z];
                _updateZone(zone);

            }
            if(_areNoneSelected(zones)){
                zones[0].isSelected = true;
            }
            _storeUserPreferences();
            return _userPrefs.zones;
        };

        //verifies at least one zone is selected
        var _areNoneSelected = function(zones){

            var noneAreSelected = true;
            for(var k=0; k<zones.length; k++){
                var zone = zones[k];
                if(zone.isSelected){
                    noneAreSelected = false;
                }
            }
            return noneAreSelected;
        };

        var _updateZone = function(zone){

          if(!_userPrefs.zones.filter(function(z){ return z.id === zone.id }).length){
            zone.isSelected = false;
            _userPrefs.zones.push(zone);
          }

        };

        var _getZones = function(){
            return _userPrefs.zones;
        };

        var _getZoneById = function(id){

            var zone = null;

            for(var z=0; z< _userPrefs.zones.length; z++){
                if(id === _userPrefs.zones[z].id){
                    zone = _userPrefs.zones[z];
                }
            }

            return zone;
        }

        var _setViewSize = function(size){
            _userPrefs.viewstate.resources.size = size;
            _storeUserPreferences();
        };

        var _getUserData = function(){

            var deferred = $q.defer();
            if(_userData){
                deferred.resolve(_userData);
            } else {
                $http({
                    url: '/userdata?token='+_token.id,
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                }).success(function (data, status, headers, config) {
                    _userData = data;
                    if(data.status === 200){
                        deferred.resolve(_userData);
                    } else {
                        deferred.reject(data);
                    }

                }).error(function (data, status, headers, config) {
                    deferred.reject(_userData);
                });
            }
            return deferred.promise;
        };

        var _parseUserPreferences = function(){

            var deferred = $q.defer();

            _getUserData().then(function(response){
                _userPrefsKey = response.data.uid;
                var userPrefs = ClientStorage.getLocal(_userPrefsKey);

                if(userPrefs){
                    userPrefs = JSON.parse(userPrefs);
                    _userPrefs = userPrefs;
                } else { //store default user prefs where none exist in local storage
                    _storeUserPreferences();
                }
                deferred.resolve(_userPrefs);
            });
            return deferred.promise;
        };

        var _getUserPreferences = function(){

            var deferred = $q.defer();

            if(!_userPrefsKey || !_userPrefs){
                _parseUserPreferences().then(function(userPrefs){
                    deferred.resolve(userPrefs);
                });
            } else {
                deferred.resolve(_userPrefs);
            }
            return deferred.promise;
        };

        var _getUserZone = function(){
            return _userzone;
        };

        var _setSuspendWarningToggle = function(val){
          ClientStorage.storeLocal('suspendWarningToggle', val);
        }

        var _getSuspendWarningToggle = function(){
          return JSON.parse(ClientStorage.getLocal('suspendWarningToggle'));
        }

        return {
            init: _init,
            getSuspendWarningToggle: _getSuspendWarningToggle,
            setSuspendWarningToggle: _setSuspendWarningToggle,
            getScope: _getScope,
            getToken: _getToken,
            getUser: _getUser,
            setLastZone: _setLastZone,
            getLastZone: _getLastZone,
            getZones: _getZones,
            updateZones: _updateZones,
            getSelectedZoneIds: _getSelectedZoneIds,
            getSelectedRemotes: _getSelectedRemotes,
            parseUserPreferences: _parseUserPreferences,
            getUserPreferences: _getUserPreferences,
            getUserZone: _getUserZone,
            setViewSize: _setViewSize,
            viewState: scope.viewStateObj,
            getUserData: _getUserData
        };

    }]);

}());

