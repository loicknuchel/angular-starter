'use strict';

describe('factory: CollectionUtils', function(){
  var CollectionUtils, scope;
  
  beforeEach(module('app')); // load the controller's module

  beforeEach(inject(function(_CollectionUtils_){
    CollectionUtils = _CollectionUtils_;
  }));
  
  it('should clear an array', function(){
    var arr = [1, 2, 3];
    CollectionUtils.clear(arr);
    expect(arr.length).toBe(0);
  });
});
