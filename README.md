# Angular starter

![screenshot](screenshots/dashboard.jpg)

This is a fully featured Angular app to quickly starting a new project using Angular with [grunt](http://gruntjs.com/) and [bower](http://bower.io/).
Design is greatly inspired/copied from [rdash/rdash-angular](https://github.com/rdash/rdash-angular), so, thanks for them ;)

With this template you will have :

- a login system already setted (see [UserSrv](https://github.com/loicknuchel/angular-starter/blob/master/app/scripts/services.js))
- an advanced logging & tracking errors system (see [_log.js](https://github.com/loicknuchel/angular-starter/blob/master/app/scripts/_log.js))
- [CRUD helper](https://github.com/loicknuchel/angular-starter/blob/master/app/scripts/common/crud-rest-utils.js) for standard REST webservices & [Parse](https://parse.com/)
- many helpers such as [filters for dates](https://github.com/loicknuchel/angular-starter/blob/master/app/scripts/filters.js), [storage helpers](https://github.com/loicknuchel/angular-starter/blob/master/app/scripts/common/storage.js) and many more...
- usefull libs already included :
    - [moment](http://momentjs.com/) for date manipulation
    - [lodash](http://lodash.com/) for functionnal utility helpers on collections
    - [localForage](https://github.com/mozilla/localForage) for async browser storage
    - [ngQuill](https://github.com/KillerCodeMonkey/ngQuill) text editor (alternatives: [textAngular](http://textangular.com/), [angular-meditor](https://github.com/ghinda/angular-meditor), [angular-redactor](https://github.com/TylerGarlick/angular-redactor))
    - [angular-bootstrap-colorpicker](https://github.com/buberdds/angular-bootstrap-colorpicker) (alternatives: [angular-minicolors](https://github.com/kaihenzler/angular-minicolors), [angular-spectrum-colorpicker](https://github.com/Jimdo/angular-spectrum-colorpicker), [bootstrap-colorselector](https://github.com/flaute/bootstrap-colorselector))
- And, last but not least, tests already setup with [Karma](http://karma-runner.github.io/) and [Jasmine](http://jasmine.github.io/2.1/introduction.html)

## Getting started

- `git clone git@github.com:loicknuchel/angular-starter.git` : get code on your laptop
- `cd angular-starter` : go to project root folder
- `npm install` : install all grunt dependencies
- `bower install` : to install all bower dependencies
- `grunt serve` : to test on your computer
- You're now ready with a shiny livereload :D

You have also other grunt commands :

- `grunt test` : run your test suite
- `grunt build` : build (concatenate & minify) your app

## TODO

- improve test suite !
- create some directive to create charts with highcharts
- add a calendar management
- add notifications
- create some utils for Firebase
- live exemple with github pages

## Other good dashboards

- [Flat Dream](http://condorthemes.com/flatdream/pages-profile.html) from [wrapbootstrap](https://wrapbootstrap.com/theme/flat-dream-responsive-admin-template-WB004G996)
- [Inspinia](http://webapplayers.com/inspinia_admin-v1.6/profile.html) from [wrapbootstrap](https://wrapbootstrap.com/theme/inspinia-responsive-admin-theme-WB0R5L90S)
- [Metronic](http://www.keenthemes.com/preview/metronic/theme/templates/admin/angularjs/) from [themeforest](http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469)
- [Notebook](http://flatfull.com/themes/note/)

## Feedback

Any feedback will be greatly appreciated.

Feel free to open issues / pull requests for bugs, general discussions or feature request.
