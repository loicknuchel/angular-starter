angular.module('app')

.controller('LoginCtrl', function ($scope, $state, AuthSrv){
  'use strict';
  var data = {}, fn = {};
  $scope.data = data;
  $scope.fn = fn;

  data.credentials = {
    email: '',
    password: ''
  };
  data.status = {
    form: 'login',
    loading: false,
    error: '',
    success: ''
  };


  fn.login = function(){
    data.status.loading = true;
    data.status.error = '';
    AuthSrv.login(data.credentials).then(function(user){
      data.status.loading = false;
      $state.go('user.home');
    }, function(error){
      data.credentials.password = '';
      data.status.loading = false;
      data.status.error = error.message;
    });
  };
  fn.recover = function(){
    data.status.loading = true;
    data.status.error = '';
    AuthSrv.passwordRecover(data.credentials).then(function(){
      data.status.loading = false;
      data.status.success = 'Check your inbox for password recovery !';
    }, function(error){
      data.status.loading = false;
      data.status.error = error.message;
    });
  };
  fn.signup = function(){
    data.status.loading = true;
    data.status.error = '';
    AuthSrv.signup(data.credentials).then(function(user){
      data.status.loading = false;
      $state.go('user.home');
    }, function(error){
      data.credentials.password = '';
      data.status.loading = false;
      data.status.error = error.message;
    });
  };
})


.controller('MainCtrl', function($scope, $state, AuthSrv){
  'use strict';
  $scope.logout = function(){
    AuthSrv.logout().then(function(){
      $state.go('anon.login');
    });
  };
})


.controller('DashboardCtrl', function($scope){
  'use strict';
  $scope.alerts = [
    {type: 'success', msg: 'Thanks for visiting! Feel free to create pull requests to improve the dashboard!'},
    {type: 'danger', msg: 'Found a bug? Create an issue with as many details as you can.'}
  ];

  $scope.addAlert = function(){
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index){
    $scope.alerts.splice(index, 1);
  };
})


.controller('ParseCtrl', function($scope, TaskSrv, CrudRestUtils){
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


.controller('LibsCtrl', function($scope){
  'use strict';
  var data = {};
  $scope.data = data;

  /*
   * Alerts :
   *  - http://lipis.github.io/bootstrap-sweetalert/
   * Notifications :
   *  - http://cgross.github.io/angular-notify/demo/
   *  - http://jvandemo.github.io/angular-growl-notifications/
   *
   * Dashboards :
   *  - http://webapplayers.com/inspinia_admin-v1.6/ (https://wrapbootstrap.com/theme/inspinia-responsive-admin-theme-WB0R5L90S)
   *  - http://condorthemes.com/flatdream/ (https://wrapbootstrap.com/theme/flat-dream-responsive-admin-template-WB004G996)
   *  - http://rubix.sketchpixy.com/ltr/#/app/dashboard (https://wrapbootstrap.com/theme/rubix-reactjs-powered-admin-template-WB09498FH)
   */
  data.libs = [{
    name: 'ng-admin',
    url: 'https://github.com/marmelab/ng-admin',
    description: 'Easily add an admin CRUD to any REST API !',
    demo: 'http://ng-admin.marmelab.com/'
  },{
    name: 'sensei-grid',
    url: 'https://github.com/datazenit/sensei-grid',
    description: 'Simple data grid (excel like) with edit functions',
    demo: 'https://datazenit.com/static/sensei-grid/examples/'
  },{
    name: 'ment.io',
    url: 'https://github.com/jeff-collins/ment.io',
    description: 'Twitter like textarea typeahead based on a trigger character',
    demo: 'http://jeff-collins.github.io/ment.io/'
  }];

  data.samples = [{
    name: 'keen-dashboards',
    url: 'https://github.com/keen/dashboards',
    description: 'Sample dashboard layouts from keen.io',
    demo: 'http://keen.github.io/dashboards/'
  }, {
    name: 'dashboard-samples',
    url: 'http://thedesigninspiration.com/articles/25-innovative-dashboard-concepts-and-designs/',
    description: '25 Innovative Dashboard Concepts and Designs'
  }];
});
