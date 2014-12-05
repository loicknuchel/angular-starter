# AngularJS dashboard

![screenshot](screenshots/dashboard.jpg)

Fully featured dashboard built with AngularJS. This project is ideal to start an AngularJS app using [grunt](http://gruntjs.com/) and [bower](http://bower.io/).
It's greatly inspired/copied from [rdash/rdash-angular](https://github.com/rdash/rdash-angular) but adapted with other tools and with more features.

With this template you will have :

- a login system already setted (see [UserSrv](https://github.com/loicknuchel/angularjs-dashboard/blob/master/app/scripts/services.js))
- an advanced logging & tracking errors system (see [_log.js](https://github.com/loicknuchel/angularjs-dashboard/blob/master/app/scripts/_log.js))
- CRUD helper for standard REST webservices & [Parse](https://parse.com/)
- many helpers such as [filters for dates](https://github.com/loicknuchel/angularjs-dashboard/blob/master/app/scripts/filters.js), [crud builders](https://github.com/loicknuchel/angularjs-dashboard/blob/master/app/scripts/common/crud-rest-utils.js), [storage helpers](https://github.com/loicknuchel/angularjs-dashboard/blob/master/app/scripts/common/storage.js) and many more...
- usefull libs already included :
    - [moment](http://momentjs.com/) for date manipulation
    - [lodash](http://lodash.com/) for functionnal utility helpers on collections
    - [localForage](https://github.com/mozilla/localForage) for async browser storage
    - [ngQuill](https://github.com/KillerCodeMonkey/ngQuill) text editor (alternatives: [textAngular](http://textangular.com/), [angular-meditor](https://github.com/ghinda/angular-meditor), [angular-redactor](https://github.com/TylerGarlick/angular-redactor))
    - [angular-bootstrap-colorpicker](https://github.com/buberdds/angular-bootstrap-colorpicker) (alternatives: [angular-minicolors](https://github.com/kaihenzler/angular-minicolors), [angular-spectrum-colorpicker](https://github.com/Jimdo/angular-spectrum-colorpicker), [bootstrap-colorselector](https://github.com/flaute/bootstrap-colorselector))

## Getting started

- clone the repo `git clone git@github.com:loicknuchel/angular-dashboard.git`
- go to project folder `cd angularjs-dashboard`
- run `npm install`
- run `bower install`
- run `grunt serve`
- You're setup with a shiny livereload :D

## TODO

- create some directive to create charts with highcharts
- add a calendar management
- add notifications
- create some utils for Firebase
- live exemple en github pages

## Other good dashboards

- [Flat Dream](http://condorthemes.com/flatdream/pages-profile.html) from [wrapbootstrap](https://wrapbootstrap.com/theme/flat-dream-responsive-admin-template-WB004G996)
- [Inspinia](http://webapplayers.com/inspinia_admin-v1.6/profile.html) from [wrapbootstrap](https://wrapbootstrap.com/theme/inspinia-responsive-admin-theme-WB0R5L90S)
- [Metronic](http://www.keenthemes.com/preview/metronic/theme/templates/admin/angularjs/) from [themeforest](http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469)

## Feedback

Any feedback will be greatly appreciated.

Feel free to open issues / pull requests for bugs, general discussions or feature request.
