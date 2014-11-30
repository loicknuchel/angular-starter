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

  this.$get = ['CrudRestUtils', function(CrudRestUtils){
    return {
      createCrud: function(objectUrl, _processBreforeSave, _useCache){
        var endpointUrl = 'https://api.parse.com/1'+objectUrl;
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
        var _httpConfig = {
          headers: {
            'X-Parse-Application-Id': parseCredentials.applicationId,
            'X-Parse-REST-API-Key': parseCredentials.restApiKey
          }
        };

        return CrudRestUtils.createCrud(endpointUrl, objectKey, _getData, _processBreforeSave, _useCache, _httpConfig);
      }
    }
  }];
});
