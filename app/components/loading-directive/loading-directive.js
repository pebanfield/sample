angular.module('csf.loader', [])
  .directive("csfLoader", [function(){
    return {
      restrict: "A",
      replace: true,
      templateUrl: 'components/loading-directive/loader.html',
      link: function(scope, el, attr, ctrl){
        var fullscreen = el.data('fullscreen');
        if(fullscreen){
          el.addClass('fullscreen')
        }
      }
    }
  }]);
