var Config = (function(){
  'use strict';
  var cfg = {
    appVersion: '~',
    debug: true, // to toggle features between dev & prod
    verbose: true, // should log in console more infos
    track: false, // should send tracking events to a server
    storage: true, // should save data to browser storage
    storagePrefix: 'app-', // prefix all stoarge entries with this prefix
    emailSupport: '',
    backendUrl: '',
    parse: {
      applicationId: 'Qm1ixHWM9SenQ7fUkW5zlZarg4YUU4pKQcHcVSYp',
      restApiKey: 'MiQdMKC1zHduz5nq6CvJGqaD0kgp5ODVc8RNeAxT'
    }
  };
  return cfg;
})();
