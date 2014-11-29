angular.module('app')

.factory('Utils', function($timeout, $q){
  'use strict';
  var service = {
    createUuid: createUuid,
    extendDeep: extendDeep,
    isEmail: isEmail,
    startsWith: startsWith,
    endsWith: endsWith,
    randInt: randInt,
    async: async,
    debounce: debounce
  };

  function createUuid(){
    function S4(){ return (((1+Math.random())*0x10000)|0).toString(16).substring(1); }
    return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0,3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
  }

  function extendDeep(dest){
    angular.forEach(arguments, function(arg){
      if(arg !== dest){
        angular.forEach(arg, function(value, key){
          if(dest[key] && typeof dest[key] === 'object'){
            extendDeep(dest[key], value);
          } else {
            dest[key] = angular.copy(value);
          }
        });
      }
    });
    return dest;
  }

  function isEmail(str){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(str);
  }

  function startsWith(str, prefix){
    return str.indexOf(prefix) === 0;
  }

  function endsWith(str, suffix){
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  function randInt(min, max){
    return Math.floor(Math.random()*(max - min + 1)) - min;
  }

  function async(fn){
    var defer = $q.defer();
    $timeout(function(){
      defer.resolve(fn());
    }, 0);
    return defer.promise;
  }

  var debounces = [];
  function debounce(key, callback, _debounceTime){
    $timeout.cancel(debounces[key]);
    debounces[key] = $timeout(function(){
      callback();
    }, _debounceTime || 1000);
  }

  return service;
});
