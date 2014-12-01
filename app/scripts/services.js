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
    isAuthorizedAsync: isAuthorizedAsync,
    isLoggedIn: isLoggedIn,
    isLoggedInAsync: isLoggedInAsync,
    signup: signup,
    login: login,
    passwordRecover: passwordRecover,
    logout: logout,
    accessLevels: routingConfig.accessLevels,
    userRoles: routingConfig.userRoles
  };

  function isAuthorized(accessLevel, _role){
    var role = _role !== undefined ? _role : StorageUtils.getSync(storageKey, defaultUser).role;
    return accessLevel.bitMask & role.bitMask;
  }
  function isAuthorizedAsync(accessLevel, _role){
    var rolePromise = _role !== undefined ? $q.when(_role) : StorageUtils.get(storageKey, defaultUser).then(function(user){ return user.role; });
    return rolePromise.then(function(role){
      return accessLevel.bitMask & role.bitMask;
    });
  }

  function isLoggedIn(_user){
    var user = _user !== undefined ? _user : StorageUtils.getSync(storageKey, defaultUser);
    return user.role && user.role.title !== routingConfig.userRoles.public.title;
  }
  function isLoggedInAsync(_user){
    var userPromise = _user !== undefined ? $q.when(_user) : StorageUtils.get(storageKey, defaultUser);
    return userPromise.then(function(user){
      return user.role && user.role.title !== routingConfig.userRoles.public.title;
    });
  }

  function signup(credentials){
    if(credentials.email && credentials.password){
      return _signupProxy({
        username: credentials.email,
        password: credentials.password,
        email: credentials.email,
        role: routingConfig.userRoles.user
      }).then(function(user){
        return StorageUtils.set(storageKey, user).then(function(){
          return user;
        });
      }, function(err){
        return $q.reject({message: err.data.error});
      });
    } else {
      return $q.reject({message: 'Error: please fill email AND password !'});
    }
  }

  function _signupProxy(user){
    return $q.when(user);
    //return ParseUtils.signup(user);
  }

  function login(credentials){
    if(credentials.email && credentials.password){
      return _loginProxy(credentials.email, credentials.password).then(function(user){
        return StorageUtils.set(storageKey, user).then(function(){
          return user;
        });
      }, function(err){
        return $q.reject({message: err.data.error});
      });
    } else {
      return $q.reject({message: 'Error: please fill email AND password !'});
    }
  }

  function _loginProxy(email, password){
    return $q.when({ email: email, username: email, role: routingConfig.userRoles.user });
    //return ParseUtils.login(email, password);
  }

  function passwordRecover(credentials){
    if(credentials.email){
      return _passwordRecoverProxy(credentials.email).then(null, function(err){
        return $q.reject({message: err.data.error});
      });
    } else {
      return $q.reject({message: 'Error: please fill email for account to recover !'});
    }
  }

  function _passwordRecoverProxy(email){
    return $q.when();
    //return ParseUtils.passwordRecover(email);
  }

  function logout(){
    return StorageUtils.remove(storageKey);
  }

  return service;
});
