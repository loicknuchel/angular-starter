angular.module('app')


.factory('UserSrv', function($q, $http, StorageUtils, Utils){
  'use strict';
  var storageKey = 'user';
  var defaultUser = { username: '', role: routingConfig.userRoles.public };
  var userCrud = null;
  var service = {
    getCurrent: getCurrent,
    isAuthorized: isAuthorized,
    isAuthorizedAsync: isAuthorizedAsync,
    isLoggedIn: isLoggedIn,
    isLoggedInAsync: isLoggedInAsync,
    signup: signup,
    login: login,
    passwordRecover: passwordRecover,
    logout: logout,
    saveUser: saveUser,
    accessLevels: routingConfig.accessLevels,
    userRoles: routingConfig.userRoles
  };
  getCurrent().then(function(user){
    //userCrud = CrudRestUtils.createCrud('/users');
    //userCrud = ParseUtils.createUserCrud(user.sessionToken);
  });

  function getCurrent(){ return StorageUtils.get(storageKey, defaultUser); }
  function getCurrentSync(){ return StorageUtils.getSync(storageKey, defaultUser); }

  function saveUser(user){
    if(userCrud){
      return userCrud.save(user).then(function(){
        return StorageUtils.set(storageKey, user);
      });
    } else {
      return StorageUtils.set(storageKey, user);
    }
  }
  function savePartialUser(data){
    return getCurrent().then(function(user){
      if(userCrud){
        return userCrud.savePartial(user, data).then(function(){
          Utils.extendDeep(user, data);
          return StorageUtils.set(storageKey, user).then(function(){
            return user;
          });
        });
      } else {
        Utils.extendDeep(user, data);
        return StorageUtils.set(storageKey, user).then(function(){
          return user;
        });
      }
    });
  }

  function isAuthorized(accessLevel, _role){
    var role = _role !== undefined ? _role : getCurrentSync().role;
    return accessLevel.bitMask & role.bitMask;
  }
  function isAuthorizedAsync(accessLevel, _role){
    var rolePromise = _role !== undefined ? $q.when(_role) : getCurrent().then(function(user){ return user.role; });
    return rolePromise.then(function(role){
      return accessLevel.bitMask & role.bitMask;
    });
  }

  function isLoggedIn(_user){
    var user = _user !== undefined ? _user : getCurrentSync();
    return user.role && user.role.title !== routingConfig.userRoles.public.title;
  }
  function isLoggedInAsync(_user){
    var userPromise = _user !== undefined ? $q.when(_user) : getCurrent();
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

  function passwordRecover(credentials){
    if(credentials.email){
      return _passwordRecoverProxy(credentials.email).then(null, function(err){
        return $q.reject({message: err.data.error});
      });
    } else {
      return $q.reject({message: 'Error: please fill email for account to recover !'});
    }
  }

  function logout(){
    return StorageUtils.remove(storageKey);
  }

  function _signupProxy(user){
    return $q.when(user);
    //return ParseUtils.signup(user);
  }

  function _loginProxy(email, password){
    return $q.when({ email: email, username: email, role: routingConfig.userRoles.user });
    //return ParseUtils.login(email, password);
  }

  function _passwordRecoverProxy(email){
    return $q.when();
    //return ParseUtils.passwordRecover(email);
  }

  return service;
});
