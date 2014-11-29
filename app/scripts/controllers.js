angular.module('app')

.controller('LoginCtrl', function ($scope, $state, AuthSrv){
  'use strict';
  $scope.credentials = {
    email: '',
    password: '',
    loading: false,
    error: ''
  };

  $scope.login = function(){
    $scope.credentials.loading = true;
    AuthSrv.login($scope.credentials).then(function(user){
      $scope.credentials.loading = false;
      $state.go('user.home');
    }, function(error){
      $scope.credentials.password = '';
      $scope.credentials.loading = false;
      $scope.credentials.error = error.message;
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


.controller('LibsCtrl', function($scope){
  'use strict';
  var data = {};
  $scope.data = data;

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
