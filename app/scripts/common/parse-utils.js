angular.module('app')

.provider('ParseUtils', function(){
  'use strict';
  var parseCredentials = {
    applicationId: null,
    restApiKey: null
  };

  this.initialize = function(applicationId, restApiKey) {
    parseCredentials.applicationId = applicationId;
    parseCredentials.restApiKey = restApiKey;
  };

  this.$get = ['$http', '$q', 'CrudRestUtils', function($http, $q, CrudRestUtils){
    var service = {
      createCrud: createCrud,
      signup: signup,
      login: login,
      passwordRecover: passwordRecover
    };
    var parseUrl = 'https://api.parse.com/1';
    var parseHttpConfig = {
      headers: {
        'X-Parse-Application-Id': parseCredentials.applicationId,
        'X-Parse-REST-API-Key': parseCredentials.restApiKey
      }
    };

    function createCrud(objectUrl, _processBreforeSave, _useCache){
      var endpointUrl = parseUrl+objectUrl;
      var objectKey = 'objectId';
      var _getData = function(result){
        if(result && result.data){
          if(!result.data[objectKey] && result.data.results){
            return result.data.results;
          } else {
            return result.data;
          }
        }
      };

      return CrudRestUtils.createCrud(endpointUrl, objectKey, _getData, _processBreforeSave, _useCache, parseHttpConfig);
    }

    // user MUST have fields 'username' and 'password'. The first one should be unique, application wise.
    function signup(user){
      if(user && user.username && user.password){
        return $http.post(parseUrl+'/users', user, parseHttpConfig).then(function(result){
          var newUser = angular.copy(user);
          delete newUser.password;
          newUser.objectId = result.data.objectId;
          newUser.sessionToken = result.data.sessionToken;
          return newUser;
        });
      } else {
        return $q.reject({data: {error: 'user MUST have fields username & password !'}});
      }
    }

    function login(username, password){
      return $http.get(parseUrl+'/login?username='+encodeURIComponent(username)+'&password='+encodeURIComponent(password), parseHttpConfig).then(function(result){
        return result.data;
      });
    }

    function passwordRecover(email){
      return $http.post(parseUrl+'/requestPasswordReset', {email: email}, parseHttpConfig).then(function(){
        // return nothing
      });
    }

    return service;
  }];
});
