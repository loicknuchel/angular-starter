angular.module('app')


.directive('sort', function(){
  'use strict';
  return {
    restrict: 'A',
    template: ['<i class="fa fa-sort-desc" ng-if="isActive() && !sort.desc"></i>'+
               '<i class="fa fa-sort-asc" ng-if="isActive() && sort.desc"></i>'+
               '<i class="fa fa-sort none" ng-if="!isActive()"></i>'+
               ' <span ng-transclude></span>'].join(''),
    scope: {
      name: '@',
      sort: '='
    },
    transclude: true,
    link: function(scope, element, attr){
      element.addClass('sort');

      scope.$watch('sort.order', function(val){
        if(val === scope.name){
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      });

      scope.isActive = function(){
        return scope.name === scope.sort.order;
      };
    }
  };
})


.directive('loadingButton', function(){
  'use strict';
  return {
    restrict: 'E',
    template: ['<button type="{{btnType ? btnType : \'button\'}}" class="btn {{btnClass}}" ng-disabled="btnDisabled || btnLoading">'+
               '<i class="fa fa-spinner fa-spin" ng-if="btnLoading"></i>'+
               '<i class="{{btnIcon}}" ng-if="btnIcon && !btnLoading"></i>'+
               ' <span ng-transclude></span>'+
               '</button>'].join(''),
    scope: {
      btnLoading: '=',
      btnDisabled: '=',
      btnIcon: '@',
      btnType: '@',
      btnClass: '@'
    },
    transclude: true
  };
})


.directive('debounce', function($timeout){
  'use strict';
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 99,
    link: function(scope, element, attr, ngModelCtrl){
      if(attr.type === 'radio' || attr.type === 'checkbox'){ return; }

      var debounce;
      element.unbind('input');
      element.bind('input', function(){
        $timeout.cancel(debounce);
        debounce = $timeout(function(){
          scope.$apply(function(){
            ngModelCtrl.$setViewValue(element.val());
          });
        }, attr.ngDebounce || 1000);
      });
      element.bind('blur', function(){
        scope.$apply(function(){
          ngModelCtrl.$setViewValue(element.val());
        });
      });
    }
  };
})


.directive('rdWidget', function(){
  'use strict';
  var directive = {
    transclude: true,
    template: '<div class="widget" ng-transclude></div>',
    restrict: 'EA'
  };
  return directive;
})


.directive('rdWidgetHeader', function(){
  'use strict';
  var directive = {
    requires: '^rdWidget',
    scope: {
      title: '@',
      icon: '@'
    },
    transclude: true,
    template: '<div class="widget-header"> <i class="fa" ng-class="icon"></i> {{title}} <div class="pull-right" ng-transclude></div></div>',
    restrict: 'E'
  };
  return directive;
})


.directive('rdWidgetBody', function(){
  'use strict';
  var directive = {
    requires: '^rdWidget',
    scope: {
      loading: '@?'
    },
    transclude: true,
    template: '<div class="widget-body"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
    restrict: 'E'
  };
  return directive;
})


/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
.directive('rdLoading', function (){
  'use strict';
  var directive = {
    restrict: 'AE',
    template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
  };
  return directive;
});
