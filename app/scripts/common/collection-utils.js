angular.module('app')

.factory('CollectionUtils', function(){
  'use strict';
  var service = {
    clear: clear,
    copy: copy,
    updateElt: updateElt,
    upsertElt: upsertElt,
    removeElt: removeElt,
    updateEltBy: updateEltBy,
    upsertEltBy: upsertEltBy,
    removeEltBy: removeEltBy,
    toMap: toMap,
    toArray: toArray,
    size: size,
    isEmpty: isEmpty,
    isNotEmpty: function(col){return !isEmpty(col);}
  };

  function clear(col){
    if(Array.isArray(col)){
      while(col.length > 0) { col.pop(); }
    } else {
      for(var i in col){
        delete col[i];
      }
    }
  }

  function copy(src, dest){
    if(Array.isArray(dest)){
      clear(dest);
      for(var i in src){
        dest.push(src[i]);
      }
    }
  }

  function updateElt(collection, selector, elt){
    var foundElt = _.find(collection, selector);
    if(foundElt){
      var replacedElt = angular.copy(foundElt);
      angular.copy(elt, foundElt);
      return replacedElt;
    }
  }
  function upsertElt(collection, selector, key, elt){
    var foundElt = _.find(collection, selector);
    if(foundElt){
      var replacedElt = angular.copy(foundElt);
      angular.copy(elt, foundElt);
      return replacedElt;
    } else {
      if(Array.isArray(collection)){ collection.push(elt); }
      else { collection[key] = elt; }
    }
  }
  function removeElt(collection, selector){
    _.remove(collection, selector);
  }

  function updateEltBy(collection, elt, keyAttr){
    var selector = {};
    selector[keyAttr] = elt[keyAttr];
    return updateElt(collection, selector, elt);
  }
  function upsertEltBy(collection, elt, keyAttr){
    var selector = {};
    selector[keyAttr] = elt[keyAttr];
    return upsertElt(collection, selector, elt[keyAttr], elt);
  }
  function removeEltBy(collection, elt, keyAttr){
    var selector = {};
    selector[keyAttr] = elt[keyAttr];
    return removeElt(collection, selector);
  }

  function toMap(arr){
    var map = {};
    if(Array.isArray(arr)){
      for(var i in arr){
        map[arr[i].id] = arr[i];
      }
    }
    return map;
  }

  function toArray(map, addTo){
    var arr = addTo ? addTo : [];
    for(var i in map){
      map[i].id = i;
      arr.push(map[i]);
    }
    return arr;
  }

  function size(col){
    if(Array.isArray(col)){
      return col.length;
    } else {
      return Object.keys(col).length;
    }
  }

  function isEmpty(col){
    return size(col) === 0;
  }

  return service;
});
