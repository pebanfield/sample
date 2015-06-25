angular.module('cloudweb.compute', ['ui.router', 'csf.services'])
  .config(
    [         '$stateProvider',
    function ( $stateProvider, AppData) {
      $stateProvider
      .state('compute', {
        abstract: true,
        url: '/compute',
        templateUrl: '/modules/compute/compute.html',
        resolve: {
            userIsRegistered: ['IdentityService', '$state',function(IdentityService){
                return IdentityService.checkUserRegistration();
            }],
            userPreferences: ['AppData',
            function(AppData){
              return AppData.getUserPreferences();
            }]
        }
      })

      .state('compute.resources', {
        url: '',
        templateUrl: '/modules/compute/views/compute.html',
        controller: 'ComputeCtrl as compute',
        resolve: {
          userPreferences: ['AppData', function(AppData){
            return AppData.getUserPreferences();
          }]
        }
      })

      .state('compute.resources.cardLg', {
        url: '',
        templateUrl: 'modules/compute/partials/resources_card_lg.html'
      })

      .state('compute.resources.list', {
        url: '',
        templateUrl: 'modules/compute/modules/list-view/list-view.html',
        controller: 'ListViewCtrl as listView'
      })

      .state('provision', {
        url: '/compute/provision',
        templateUrl: 'modules/compute/views/forms/provisioning/provisionbase.html',
        controller: 'ProvisionBaseCtrl'
      })

      .state('provision.form', {
        url: '/required',
        templateUrl: 'modules/compute/views/forms/provisioning/provisionrequired.html',
        controller: 'ProvisionRequiredCtrl'
      })
      .state('provision.options', {
        url: '/options',
        templateUrl: 'modules/compute/views/forms/provisioning/provisionoptions.html',
        controller: 'ProvisionOptionsCtrl'
      })
      .state('provision.confirm', {
        url: '/confirm',
        templateUrl: 'modules/compute/views/forms/provisioning/provisionconfirm.html',
        controller: 'ProvisionConfirmCtrl'
      })
      .state('provision.complete', {
        url: '/complete',
        templateUrl: 'modules/compute/views/forms/provisioning/provisioncomplete.html',
        controller: 'ProvisionCompleteCtrl'
      })
      .state('instancedetails', {
        url: '/compute/zones/id/:zone_id/resources/id/:resource_id',
        templateUrl: 'modules/compute/views/details/instancedetails.html',
        controller: 'InstanceDetailsBaseCtrl'
      })
      .state('instancedetails.summary', {
        url: '/summary',
        templateUrl: 'modules/compute/views/details/summary.html',
        controller: 'DeviceSummaryCtrl'
      })
      .state('instancedetails.monitoring', {
        url: '/monitoring',
        templateUrl: 'modules/compute/views/details/monitoring.html',
        controller: 'DeviceMonitorCtrl'
      })
      .state('instancedetails.metrics', {
        url: '/metrics',
        templateUrl: 'modules/compute/views/details/metrics.html',
        controller: 'DeviceMetricsCtrl'
      })
      .state('instancedetails.log', {
        url: '/log',
        templateUrl: 'modules/compute/views/details/log.html',
        controller: 'DeviceLogCtrl'
      })
      .state('instancedetails.vnc', {
        url: '/vnc',
        templateUrl: 'modules/compute/views/details/vnc.html',
        controller: 'DeviceVNCCtrl'
      })
      .state('instancedetails.patches', {
        url: '/patches',
        templateUrl: 'modules/compute/views/details/patches.html',
        controller: 'DevicePatchesCtrl'
      });
    }
  ]
  )
