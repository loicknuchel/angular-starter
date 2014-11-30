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

  this.$get = ['$http', '$q', 'CollectionUtils', function($http, $q, CollectionUtils){
    var service = {
      createCrud: createCrud
    };

    function createCrud(objectUrl, _processBreforeSave){
      var objectKey = 'objectId';
      var cache = [];
      var CrudSrv = {
        cache:    cache,
        eltKey:   objectKey,
        getUrl:   function(_id) { return _parseUrl(objectUrl, _id);                                         },
        getAll:   function()    { return _crudGetAll(objectUrl, cache);                                     },
        get:      function(id)  { return _crudGet(id, objectUrl, objectKey, cache);                         },
        save:     function(elt) { return _crudSave(elt, objectUrl, objectKey, cache, _processBreforeSave);  },
        remove:   function(elt) { return _crudRemove(elt, objectUrl, objectKey, cache);                     }
      };
      return CrudSrv;
    }


    function _crudGetAll(objectUrl, cache){
      return _parseGet(objectUrl).then(function(elts){
        if(Array.isArray(elts)){
          CollectionUtils.copy(elts, cache);
          return elts;
        }
      });
    }

    function _crudGet(id, objectUrl, objectKey, cache){
      return _parseGet(objectUrl, id).then(function(elt){
        if(elt && elt.id){
          CollectionUtils.upsertEltBy(cache, elt, objectKey);
          return elt;
        }
      });
    }

    function _crudSave(elt, objectUrl, objectKey, cache, _processBreforeSave){
      if(elt){
        if(typeof _processBreforeSave === 'function'){ _processBreforeSave(elt); }
        var promise = null;
        if(elt[objectKey]){ // update
          promise = _parsePut(objectUrl, elt[objectKey], elt);
        } else { // create
          promise = _parsePost(objectUrl, elt);
        }
        return promise.then(function(createdObjectId){
          var newElt = angular.copy(elt);
          if(!newElt[objectKey]){
            newElt[objectKey] = createdObjectId;
          }
          CollectionUtils.upsertEltBy(cache, newElt, objectKey);
          return newElt;
        });
      } else {
        return $q.when();
      }
    }

    function _crudRemove(elt, objectUrl, objectKey, cache){
      if(elt && elt[objectKey]){
        return _parseDelete(objectUrl, elt[objectKey]).then(function(){
          CollectionUtils.removeEltBy(cache, elt, objectKey);
        });
      } else {
        return $q.when();
      }
    }


    function _parseGet(objectUrl, _id){
      return $http.get(_parseUrl(objectUrl, _id), {
        headers: {
          'X-Parse-Application-Id': parseCredentials.applicationId,
          'X-Parse-REST-API-Key': parseCredentials.restApiKey
        }
      }).then(function(result){
        return _id ? result.data : result.data.results;
      });
    }
    function _parsePost(objectUrl, elt){
      return $http.post(_parseUrl(objectUrl), elt, {
        headers: {
          'X-Parse-Application-Id': parseCredentials.applicationId,
          'X-Parse-REST-API-Key': parseCredentials.restApiKey
        }
      }).then(function(result){
        return result.data.objectId;
      });
    }
    function _parsePut(objectUrl, id, elt){
      return $http.put(_parseUrl(objectUrl, id), elt, {
        headers: {
          'X-Parse-Application-Id': parseCredentials.applicationId,
          'X-Parse-REST-API-Key': parseCredentials.restApiKey
        }
      }).then(function(result){
        // return nothing
      });
    }
    function _parseDelete(objectUrl, id){
      return $http.delete(_parseUrl(objectUrl, id), {
        headers: {
          'X-Parse-Application-Id': parseCredentials.applicationId,
          'X-Parse-REST-API-Key': parseCredentials.restApiKey
        }
      }).then(function(result){
        // return nothing
      });
    }
    function _parseUrl(objectUrl, _id){
      return 'https://api.parse.com/1'+objectUrl+(_id ? '/'+_id : '');
    }

    return service;
  }];
});
