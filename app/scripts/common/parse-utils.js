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

  this.$get = ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory){
    var service = {
      createCrud: createCrud
    };

    function createCrud(objectUrl, _processBreforeSave, _useCache){
      var objectKey = 'objectId';
      var cache = _useCache ? $cacheFactory(objectUrl) : null;
      var CrudSrv = {
        eltKey:   objectKey,
        getUrl:   function(_id)           { return _parseUrl(objectUrl, _id);                                         },
        getAll:   function(_noCache)      { return _crudGetAll(objectUrl, objectKey, cache, _noCache);                },
        get:      function(id, _noCache)  { return _crudGet(id, objectUrl, objectKey, cache, _noCache);               },
        save:     function(elt)           { return _crudSave(elt, objectUrl, objectKey, _processBreforeSave, cache);  },
        remove:   function(elt)           { return _crudRemove(elt, objectUrl, objectKey, cache);                     }
      };
      if(cache != null){
        CrudSrv.cache = cache;
      }
      return CrudSrv;
    }


    function _crudGetAll(objectUrl, objectKey, _cache, _noCache){
      var url = _parseUrl(objectUrl);
      if(_cache && _noCache){ _cache.remove(url); }
      return $http.get(url, _parseConfig(_cache)).then(function(result){
        var elts = result.data.results;
        if(Array.isArray(elts)){
          if(_cache){ // add all individual elements to cache !
            for(var i in elts){
              _setInCache(_cache, objectUrl, objectKey, result, elts[i]);
            }
          }
          return elts;
        }
      });
    }

    function _crudGet(id, objectUrl, objectKey, _cache, _noCache){
      var url = _parseUrl(objectUrl, id);
      if(_cache && _noCache){ _cache.remove(url); }
      return $http.get(url, _parseConfig(_cache)).then(function(result){
        if(result.data && result.data[objectKey]){
          return result.data;
        }
      });
    }

    function _crudSave(elt, objectUrl, objectKey, _processBreforeSave, _cache){
      if(elt){
        if(typeof _processBreforeSave === 'function'){ _processBreforeSave(elt); }
        var promise = null;
        if(elt[objectKey]){ // update
          promise = $http.put(_parseUrl(objectUrl, elt[objectKey]), elt, _parseConfig());
        } else { // create
          promise = $http.post(_parseUrl(objectUrl), elt, _parseConfig());
        }
        return promise.then(function(result){
          var newElt = angular.copy(elt);
          if(!newElt[objectKey] && result.data[objectKey]){ newElt[objectKey] = result.data[objectKey]; }
          _setInCache(_cache, objectUrl, objectKey, result, newElt);
          return newElt;
        });
      } else {
        return $q.when();
      }
    }

    function _crudRemove(elt, objectUrl, objectKey, _cache){
      if(elt && elt[objectKey]){
        var url = _parseUrl(objectUrl, elt[objectKey]);
        return $http.delete(url, _parseConfig()).then(function(result){
          if(_cache){ _cache.remove(url); }
          // return nothing
        });
      } else {
        return $q.when();
      }
    }


    function _parseUrl(objectUrl, _id){
      return 'https://api.parse.com/1'+objectUrl+(_id ? '/'+_id : '');
    }
    function _parseConfig(_cache){
      var cfg = {
        headers: {
          'X-Parse-Application-Id': parseCredentials.applicationId,
          'X-Parse-REST-API-Key': parseCredentials.restApiKey
        }
      };
      if(_cache){
        cfg.cache = _cache;
      }
      return cfg;
    }
    function _setInCache(_cache, objectUrl, objectKey, result, elt){
      if(_cache){
        _cache.put(_parseUrl(objectUrl, elt[objectKey]), [result.status, JSON.stringify(elt), result.headers(), result.statusText]);
      }
    }

    return service;
  }];
});
