angular.module('cloudweb').constant('MENU', {
    items:
        [{ title:'Compute Resources',  id: 'compute', tooltip: 'Compute Resources', target: '_child', uisref: 'compute.resources', class: 'fa fa-desktop fa-2x', ngclass: 'compute.resources'},
         { title:'Database Resources', id: 'database', tooltip: 'Database Resources',target: '_self', uisref: 'databases.list', class: 'fa fa-database fa-2x', ngclass: 'databases'}]
});
