angular.module('app', ['ngCookies', 'LocalForageModule', 'ui.router', 'ui.bootstrap', 'ngQuill', 'colorpicker.module'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $provide, ParseUtilsProvider, Config){
  'use strict';
  // catch exceptions in angular
  $provide.decorator('$exceptionHandler', ['$delegate', function($delegate){
    return function(exception, cause){
      $delegate(exception, cause);

      var data = {
        type: 'angular'
      };
      if(cause)               { data.cause    = cause;              }
      if(exception){
        if(exception.message) { data.message  = exception.message;  }
        if(exception.name)    { data.name     = exception.name;     }
        if(exception.stack)   { data.stack    = exception.stack;    }
      }

      Logger.track('exception', data);
    };
  }]);

  var access = routingConfig.accessLevels;

  // Public routes
  $stateProvider
  .state('public', {
    abstract: true,
    template: '<ui-view/>',
    data: {
      access: access.public
    }
  });

  // Anonymous routes
  $stateProvider
  .state('anon', {
    abstract: true,
    template: '<ui-view/>',
    data: {
      access: access.anon
    }
  })
  .state('anon.login', {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  });

  // Regular user routes
  $stateProvider
  .state('user', {
    abstract: true,
    templateUrl: 'views/layout.html',
    controller: 'MainCtrl',
    data: {
      access: access.user
    }
  })
  .state('user.home', {
    url: '/',
    templateUrl: 'views/home.html'
  })
  .state('user.dashboard', {
    url: '/dashboard',
    templateUrl: 'views/samples/dashboard.html',
    controller: 'DashboardCtrl'
  })
  .state('user.tables', {
    url: '/tables',
    templateUrl: 'views/samples/tables.html'
  })
  .state('user.tasks', {
    url: '/tasks',
    templateUrl: 'views/tasks/main.html',
    controller: 'TasksCtrl'
  })
  .state('user.libs', {
    url: '/libs',
    templateUrl: 'views/samples/libs.html',
    controller: 'LibsCtrl'
  });

  $urlRouterProvider.otherwise('/');

  ParseUtilsProvider.initialize(Config.parse.applicationId, Config.parse.restApiKey);

  // logout on http status 401 or 403
  $httpProvider.interceptors.push(['$q', '$location', function($q, $location){
    return {
      'responseError': function(response){
        if(response.status === 401 || response.status === 403){
          $location.path('/login');
        }
        return $q.reject(response);
      }
    };
  }]);
})

.constant('Config', Config)

.run(function($rootScope, $state, $window, AuthSrv, LogSrv, Utils){
  'use strict';
  // init
  var data = {}, fn = {};
  $rootScope.root = {data: data, fn: fn};

  fn.toggleSidebar = function(){
    data.sidebarOpened = !data.sidebarOpened;
  };

  var mobileView = 992;
  $rootScope.$watch(function(){ return $window.innerWidth; }, function(newValue){
    if(newValue >= mobileView){
      if (data.sidebarOpened === undefined){
        data.sidebarOpened = true;
      }
    } else {
      data.sidebarOpened = false;
    }
  });

  $window.onresize = function(){ $rootScope.$apply(); };

  // Controls if user is authentified
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if(!(toState && toState.data && toState.data.access)){
      LogSrv.trackError('NoAccessRestrictionForState', 'State <'+toState.name+'> has no access data !!!');
      event.preventDefault();
    } else {
      if(!AuthSrv.isAuthorized(toState.data.access)){
        AuthSrv.isAuthorizedAsync(toState.data.access).then(function(authorized){
          if(!authorized){
            LogSrv.trackError('UnauthorizedUser', 'User tried to access <'+toState.name+'> state with no authorization !!!');
            event.preventDefault();

            if(fromState.url === '^'){
              if(AuthSrv.isLoggedIn()){
                $state.go('user.home');
              } else {
                $rootScope.error = null;
                $state.go('anon.login');
              }
            }
          }
        });
      }
    }
  });

  // utils
  $rootScope.safeApply = function(fn){
    var phase = this.$root ? this.$root.$$phase : this.$$phase;
    if(phase === '$apply' || phase === '$digest'){
      if(fn && (typeof(fn) === 'function')){
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  $rootScope.trustHtml = Utils.trustHtml;
});
