angular.module('app')

.factory('StorageUtils', function($window, $localForage, $q, Utils, Config){
  'use strict';
  var storageCache = {};
  var service = {
    get: _get,
    set: _set,
    remove: _remove,
    clear: _clear,
    clearStartingWith: _clearStartingWith
  };

  function _get(key, defaultValue){
    if(!storageCache[key]){
      if(Config.storage){
        return $localForage.getItem(Config.storagePrefix+key).then(function(value){
          try {
            storageCache[key] = JSON.parse(value) || angular.copy(defaultValue);
          } catch(e) {
            storageCache[key] = angular.copy(defaultValue);
          }
          return angular.copy(storageCache[key]);
        }, function(err){
          console.error('ERROR in LocalForageUtils._get('+key+')', err);
        });
      } else {
        storageCache[key] = angular.copy(defaultValue);
        return $q.when(angular.copy(storageCache[key]));
      }
    } else {
      return $q.when(angular.copy(storageCache[key]));
    }
  }

  function _set(key, value){
    if(key === 'user' && value && value.id && $window.localStorage && Config.storage){ // for the _log.js...
      $window.localStorage.setItem(Config.storagePrefix+key, JSON.stringify({id: value.id}));
    }

    if(!angular.equals(storageCache[key], value)){
      storageCache[key] = angular.copy(value);
      if(Config.storage){
        return $localForage.setItem(Config.storagePrefix+key, JSON.stringify(storageCache[key])).then(function(value){
          // return nothing !
        }, function(err){
          console.error('ERROR in LocalForageUtils._set('+key+')', err);
        });
      } else {
        return $q.when();
      }
    } else {
      console.debug('Don\'t save <'+key+'> because values are equals !');
      return $q.when();
    }
  }

  function _remove(key){
    console.debug('Remove <'+key+'> from storage !');
    delete storageCache[key];
    if(Config.storage){
      return $localForage.removeItem(Config.storagePrefix+key);
    } else {
      return $q.when();
    }
  }

  function _clear(){
    storageCache = {};
    if(Config.storage){
      return $localForage.clear();
    } else {
      return $q.when();
    }
  }

  function _clearStartingWith(keyStartWith){
    for(var i in storageCache){
      if(Utils.startsWith(i, keyStartWith)){
        delete storageCache[i];
      }
    }
    if(Config.storage){
      return $localForage.keys().then(function(keys){
        var promises = [];
        for(var i in keys){
          if(Utils.startsWith(keys[i], Config.storagePrefix+keyStartWith)){
            promises.push($localForage.removeItem(keys[i]));
          }
        }
        return $q.all(promises).then(function(results){
          // nothing
        });
      });
    } else {
      return $q.when();
    }
  }

  return service;
})


.factory('LocalStorageUtils', function($window, Utils, Config){
  'use strict';
  var storageCache = {};
  var service = {
    get:                function(key, defaultValue) { return Utils.async(_get(key, defaultValue));          },
    set:                function(key, value)        { return Utils.async(_set(key, value));                 },
    remove:             function(key)               { return Utils.async(_remove(key));                     },
    clear:              function()                  { return Utils.async(_clear());                         },
    clearStartingWith:  function(keyStartWith)      { return Utils.async(_clearStartingWith(keyStartWith)); },
    getSync: _get,
    setSync: _set,
    removeSync: _remove,
    clearSync: _clear,
    clearStartingWithSync: _clearStartingWith
  };


  function _get(key, defaultValue){
    if(!storageCache[key]){
      if(Config.storage && $window.localStorage){
        try {
          storageCache[key] = JSON.parse($window.localStorage.getItem(Config.storagePrefix+key)) || angular.copy(defaultValue);
        } catch(e) {
          storageCache[key] = angular.copy(defaultValue);
        }
        return angular.copy(storageCache[key]);
      } else {
        storageCache[key] = angular.copy(defaultValue);
        return angular.copy(storageCache[key]);
      }
    } else {
      return angular.copy(storageCache[key]);
    }
  }

  function _set(key, value){
    if(!angular.equals(storageCache[key], value)){
      storageCache[key] = angular.copy(value);
      if(Config.storage && $window.localStorage){
        $window.localStorage.setItem(Config.storagePrefix+key, JSON.stringify(storageCache[key]));
      }
    } else {
      console.debug('Don\'t save <'+key+'> because values are equals !');
    }
  }

  function _remove(key){
    console.debug('Remove <'+key+'> from storage !');
    delete storageCache[key];
    if(Config.storage && $window.localStorage){
      $window.localStorage.removeItem(Config.storagePrefix+key);
    }
  }

  function _clear(){
    storageCache = {};
    if(Config.storage && $window.localStorage){
      $window.localStorage.clear();
    }
  }

  function _clearStartingWith(keyStartWith){
    for(var i in storageCache){
      if(Utils.startsWith(i, keyStartWith)){
        delete storageCache[i];
      }
    }
    if(Config.storage && $window.localStorage){
      for(var j=$window.localStorage.length-1; j >= 0; j--){
        var key = $window.localStorage.key(j);
        if(Utils.startsWith(key, Config.storagePrefix+keyStartWith)){
          $window.localStorage.removeItem(key);
        }
      }
    }
  }

  return service;
});
