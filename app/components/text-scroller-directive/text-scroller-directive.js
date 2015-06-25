angular.module('csf.textScroller', [])
    .directive('textScroller', [function () {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                elm.addClass('csf-label-ellipsis');
                var slide_timer;

                var slide = function () {
                    elm.addClass('csf-label-highlight');
                    elm.removeClass('csf-label-ellipsis');
                    elm[0].scrollLeft += 1;
                    if (elm[0].scrollLeft < elm[0].scrollWidth) {
                        slide_timer = setTimeout(slide, 5);
                    }
                };

                var stopSlide = function(){
                    elm.removeClass('csf-label-highlight');
                    elm.addClass('csf-label-ellipsis');
                    clearTimeout(slide_timer);
                    elm[0].scrollLeft = 0;
                }

                elm.bind('mouseenter', slide);
                elm.bind('mouseleave', stopSlide);
            }
        }
    }]);
