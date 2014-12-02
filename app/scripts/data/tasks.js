angular.module('app')

.factory('TaskSrv', function(ParseUtils){
  'use strict';
  return ParseUtils.createCrud('/classes/Task', null, true);
})

/* Sample CRUD with Parse */
.controller('TasksCtrl', function($scope, TaskSrv, CrudRestUtils){
  'use strict';
  /*
   * TODO : add many different field types (for exemple) :
   *  - priority (select with predefined values)
   *  - dueDate (datetime picker)
   *    - https://github.com/dalelotts/angular-bootstrap-datetimepicker
   *    - http://mgcrea.github.io/angular-strap/##datepickers (http://www.eyecon.ro/bootstrap-datepicker/)
   *    - https://github.com/alongubkin/angular-datepicker
   *    - https://github.com/adamalbrecht/ngQuickDate or https://github.com/killercodemonkey/ngDatePicker
   *    - https://github.com/g00fy-/angular-datepicker
   *    - https://github.com/luisfarzati/ng-bs-daterangepicker
   *    - https://github.com/spongessuck/gm.datepickermultiselect
   */
  var defaultSort = {order: 'done', desc: true};
  var defaultFormElt = {done: false};
  $scope.crud = CrudRestUtils.createCrudCtrl(TaskSrv, defaultSort, defaultFormElt);
  $scope.cache = TaskSrv.cache;
})

.directive('task', function(Utils){
  'use strict';
  return {
    restrict: 'E',
    templateUrl: 'views/tasks/partials/details.html',
    scope: {
      elt: '='
    },
    link: function(scope, element, attr){
      scope.trustHtml = Utils.trustHtml;
    }
  };
})

.directive('taskName', function(TaskSrv){
  'use strict';
  function setName(scope){
    TaskSrv.get(scope.id).then(function(elt){
      if(elt){ scope.name = elt.name; }
      else { scope.name = scope.id; }
    }, function(){
      scope.name = scope.id;
    });
  }
  
  return {
    restrict: 'E',
    template: '<span class="relation">{{name}}</span>',
    scope: {
      id: '='
    },
    link: function(scope, element, attr){
      setName(scope);
      scope.$watch('id', function(val, old){
        if(val !== old){ setName(scope); }
      });
    }
  };
})

.directive('taskForm', function(){
  'use strict';
  return {
    restrict: 'E',
    templateUrl: 'views/tasks/partials/form.html',
    scope: {
      elt: '='
    }
  };
});
