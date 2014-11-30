angular.module('app')


.factory('TaskSrv', function(ParseUtils){
  'use strict';
  return ParseUtils.createCrud('/classes/Task', null, true);
})


.factory('AuthSrv', function($q, $http, StorageUtils){
  'use strict';
  var storageKey = 'user';
  var defaultUser = { username: '', role: routingConfig.userRoles.public };
  var service = {
    isAuthorized: isAuthorized,
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout,
    accessLevels: routingConfig.accessLevels,
    userRoles: routingConfig.userRoles
  };

  function isAuthorized(accessLevel, _role){
    var rolePromise = _role !== undefined ? $q.when(_role) : StorageUtils.get(storageKey, defaultUser).then(function(user){ return user.role; });
    return rolePromise.then(function(role){
      return accessLevel.bitMask & role.bitMask;
    });
  }

  function isLoggedIn(_user){
    var userPromise = _user !== undefined ? $q.when(_user) : StorageUtils.get(storageKey, defaultUser);
    return userPromise.then(function(user){
      return user.role && user.role.title !== routingConfig.userRoles.public.title;
    });
  }

  function login(credentials){
    var loginDefer = $q.defer();
    if(credentials.email && credentials.password){ // TODO : check user credentials !
      var user = { email: credentials.email, username: credentials.email, role: routingConfig.userRoles.user };
      StorageUtils.set(storageKey, user).then(function(){
        loginDefer.resolve(user);
      });
    } else {
      loginDefer.reject({
        message: 'Error: please fill email AND password !'
      });
    }
    return loginDefer.promise;
  }

  function logout(){
    var logoutDefer = $q.defer();
    StorageUtils.remove(storageKey).then(function(){
      logoutDefer.resolve();
    });
    return logoutDefer.promise;
  }

  return service;
});
