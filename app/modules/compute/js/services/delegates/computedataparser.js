/**
 *
 */

/* global angular, console, _, $ */

(function () {

    'use strict';

    var services = angular.module('csf.services');
    services.factory('ComputeDataParser',
        ['DNSService', '$rootScope',
        function(DNSService) {

        var _zoneHash;
        var _computeData;
        var _getDNS;

        var api = {
            transformInstanceData: _transformInstanceData,
            transformSingleInstanceData: _transformSingleInstanceData,
            transformSingleInstance: _transformSingleResource,
            findZone: _findZone,
            updateStatus: _updateStatus,
            findImage: _findImage,
            findRecipe: _findRecipe,
            findObjById: _findObjById
        };

        function _transformInstanceData(computeData, getDNS){

            //TODO - refactor has broken this - doesn't really transform anything anymore
            _getDNS = getDNS;
            _computeData = computeData;
            _zoneHash = {};

            return computeData;
        }

        function _transformSingleInstanceData(instance){

            if (!_zoneHash[instance.zoneId]){
                _zoneHash[instance.zoneId] = [];
            }
            _zoneHash[instance.zoneId].push(instance.id);
            return _transformSingleResource(instance, _getDNS);
        }

        function _transformSingleResource(resource, getDNS){


            resource.ip = resource.nodeIp;

            if (resource.ip && getDNS){

                DNSService.getRecords(resource.ip, function(data){
                    resource.dnsRecords = data;
                });

            }

            var fl = _.find(_computeData.flavors, { id: resource.flavorId });
            _computeData.flavors =
                _.sortBy(_computeData.flavors, function(o) { return o.dailyPrice; });

            try {
                resource.cpus = fl.vcpus;
                resource.ram = fl.ram;
                resource.ram_gb = Math.floor(fl.ram / 1000);
                resource.disk = fl.disk;
            } catch(error) {
                console.log("error : " + error);
            }

            var inst = _.find(_computeData.zones, { id: resource.zoneId });
            if(inst){
                resource.zoneName = inst.name;
            } else {
                console.log('Error', "Error : An resource has an unknown zoneId.");
            }

            // this sizing stuff is likely temporary since we need it in a common place for the
            // provisioning wizard as well - along with pricing. But good reference for us until we
            // get something more permanent
            if (resource.ram_gb < 4){
                resource.size = { sort: 0, label: 'Micro' };
            }else if(resource.ram_gb < 8){
                resource.size = resource.cpus < 2 ? { sort: 1, label: 'Mini' } : { sort: 2, label: 'Mini+CPU' };
            }else if (resource.ram_gb < 16){
                resource.size = resource.cpus < 2 ? { sort: 3, label: 'Small' } : { sort: 4, label: 'Small+CPU' };
            }else if (resource.ram_gb < 24){
                resource.size = resource.cpus < 4 ? { sort: 5, label: 'Medium' } : { sort: 6, label: 'Medium+CPU' };
            }else{
                resource.size = { sort: 7, label: 'Large' };
            }


            var img = _.find(_computeData.images, { id: resource.imageId });

            resource.platform = (img && img.os) ? img.os.distribution || img.name : 'Unknown';
            resource.platformDescription = (img && img.os) ? img.os.description || img.name : 'Unknown Platform';

            _parseVipStatus(resource);

            resource.type = 'instance';

            return resource;
        }

            //TODO - use lodash

        function _findObjById(arr, id){

            var match = null;

            $.each(arr, function(i, obj){
                if (obj.id === id){
                    match = obj;
                }
            });
            return match;
        }

        function _findRecipe(recipes, recipeId){

            var recipeMatch = null;

            $.each(recipes, function(r, recipe){
                if (recipe.id === recipeId){
                    recipeMatch = recipe;
                }
            });
            return recipeMatch;
        }

        function _findImage(images, imageId){

            var imageMatch = null;

            $.each(images, function(i, image){
                if (image.id === imageId){
                    imageMatch = image;
                }
            });
            return imageMatch;
        }

        function _findZone(instanceId){

            var zone = null;

            $.each(_zoneHash, function(z, guids){
                $.each(guids, function(i, guid){
                    if (instanceId === guid){
                        zone = z;
                    }
                });
            });

            return zone;
        }

        var removeDeletedInstances = function(currentInstances, updatedInstances){

            $.each(currentInstances, function(c, cInst){

                var foundInstance = _.find(updatedInstances, {id: cInst.id});

                if(!foundInstance){
                    delete currentInstances[c];
                    currentInstances = _.compact(currentInstances);
                }
            });

            return currentInstances;
        };

        var addOrSetStatus = function(currentInstances, updatedInstances){

            $.each(updatedInstances, function(i, inst){

                var currentInst = _.find(currentInstances, {id: inst.id});

                if (currentInst){
                    if (inst.status !== currentInst.status){
                        currentInst.status = inst.status;
                    }
                    if (inst.nodeIp !== currentInst.nodeIp){
                        currentInst.ip = currentInst.nodeIp = inst.nodeIp;
                    }
                    if (currentInst.vip || inst.vip){

                        if (!inst.vip){
                            inst.vip = {
                                status:'NULL'
                            };
                        }

                        try {
                            inst.vip.status = inst.vip.status.replace(/_/g,' ');
                            inst.vip.status = inst.vip.status.charAt(0) + inst.vip.status.substr(1).toLowerCase();

                            currentInst.vip.publicIp = inst.vip.publicIp;
                            currentInst.vip.status = inst.vip.status;
                        } catch(error) {
                            console.log("VIP Error : " + error)
                        }

                        if (currentInst.vip.publicIp){

                            DNSService.getRecords(currentInst.vip.publicIp, function(data){

                                currentInst.vip.dnsRecords = data;
                            });

                        }
                    }
                }else{
                    currentInst = inst;
                }

            });

            return currentInstances;
        };

        function _updateStatus(currentInstances, updatedInstances){

            currentInstances = addOrSetStatus(currentInstances, updatedInstances);
            currentInstances = removeDeletedInstances(currentInstances, updatedInstances);

            return currentInstances;
        }

        function _parseVipStatus(instance){

            if (!instance.vip){
                instance.vip = {
                    status:'NULL'
                };
            }
            instance.vip.status = instance.vip.status.replace(/_/g,' ');
            instance.vip.status = instance.vip.status.charAt(0) + instance.vip.status.substr(1).toLowerCase();

            return instance;
        }

        return api;
    }]);

}());

