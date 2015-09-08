title: "Yet Another AngularJS ES6 Webpack Seed Project"
tags:
  - AngularJS
  - Webpack
  - Javascript
categories:
  - Software Development
date: 2015-09-07
summary:
---

## AngularJS / ES6 / Webpack

I first started using [ES6](https://github.com/lukehoban/es6features) and [Webpack](https://webpack.github.io/) a few months ago whilst working with [React](http://facebook.github.io/react/)
on [Soapee](http://soapee.com) and ever since I've been finding myself missing using ES6 and Webpack when writing code for Node.js and AngularJS.

This posts presents my research on existing ES6/AngularJS seed projects and my own attempts of using ES6 and Webpack on an AngularJS single page application.

<!--more-->

## Similar Resources

Googling for [angular webpack](https://www.google.co.uk/search?q=angular+webpack) yields several resources and blog posts that document experiments
with Webpack and AngularJS. Notable resources include:

### Egghead.io

Kent Dodds put together an interesting series of videos on [Egghead](https://egghead.io) called [Angular with Webpack](https://egghead.io/lessons/angularjs-angular-with-webpack-introduction) which goes
through initial Webpack configuration, ES6 and Babel, pre-processors, production and testing. Please note that the first of these videos is free to view while the rest require premium Egghead membership.

### Jesus Rodriguez

Jesus authored a comprehensive article titled [Using Angular 1.x With ES6 and Webpack](http://angular-tips.com/blog/2015/06/using-angular-1-dot-x-with-es6-and-webpack/) which
covers the basics and outlines project folder structures, authoring directives, services, testing and so on.

### Others

Other notable blog posts includes:

+ [Angular, Webpack and ES6](https://medium.com/@lost_brogrammer/angular-webpack-and-es6-4050134f9db0) by Danny Fenstermaker
+ [Creating an application with AngularJS 1.4, ECMAScript 6, Material Design and Webpack](http://julienrenaux.fr/2015/05/05/creating-an-application-with-angularjs-1-4-ecmascript-6-material-design-and-webpack/)
by Julien Renaux
+ [Angular, webpack and gulp for an SPA](https://luwenhuang.wordpress.com/2015/01/18/refactoring-an-angular-app-to-use-webpack-and-gulp/) by Luwen-huang

## Yet Another NG6 Seed Project

My motivation for [angular-es6-webpack-seed](https://github.com/nazar/angular-es6-webpack-seed) was to build a seed project based on my previous experience on building
 a large AngularJS single page application. I also wanted to exploit the productivity gains introduced by Webpack and the following tools and libraries:

+ Nested layouts via [ui-router](https://github.com/angular-ui/ui-router), which is the closest I could get to React's [react-router](https://github.com/rackt/react-router). More on this later
+ [Bootstrap](http://getbootstrap.com) 3.3.5 with [angular-strap](http://mgcrea.github.io/angular-strap/)
+ css hot loading. Not as awesome as [react-hot-loader](https://github.com/gaearon/react-hot-loader) wit React but *great* nonetheless
+ support for AMD/CommonJS module types - namely ES6's `import from xyz 'xyz'` and ***fat-arrow*** syntax
+ ngTemplate bundling into **$templateCache** for all HTML templates
+ [ng-annotate](https://github.com/olov/ng-annotate) annotations
+ adoption of component based folder structures for controller views and directives that group files by functionality in the same folder. More on this later
+ ES6 [goodness](https://github.com/lukehoban/es6features) via [Babel](https://babeljs.io/)
+ painless project provisioning for developers via [Vagrant](https://www.vagrantup.com/) and a single source of dependencies via `npm install`
+ [Gulp](http://gulpjs.com/) based tasks for building, testing and deployment

### Getting Started

Clone [angular-es6-webpack-seed](https://github.com/nazar/angular-es6-webpack-seed) and review the [provisioning](https://github.com/nazar/angular-es6-webpack-seed/blob/master/provision/README.md)
documentation to setup a virtual development environment.

The Vagrant [configuration](https://github.com/nazar/angular-es6-webpack-seed/blob/master/Vagrantfile) file sets up a host only private network on address **192.168.30.25**
through which all ports are accessible (i.e. port 22 for SSH logins and port 8080 for the development web server). I've disabled the default Vagrant configuration which maps VM ports to the local
port (i.e. VM:8080 to local:80 and VM:22 to local: 2222) as this could become an issue that prevents multiple Vagrant VMs from running.

Once setup, start the development server using `gulp` and browse to **http://192.168.30.25:8080** to view a very basic **Bootstap** layout application.

### Files and Folders

+ **/src** - this is the application's root folder. If using **WebStorm**, set this folder as the Resource Root (under settings -> Project -> Directories)
  + **/src/assets** - contains non Angular based application resources such as global CSS, images and the rare third party JavaScript library that does not install via NPM
  + **/src/app** - the Angular application folder which defines the [boot](https://github.com/nazar/angular-es6-webpack-seed/blob/master/src/app/index.js)
 and ui-routes based [route](https://github.com/nazar/angular-es6-webpack-seed/blob/master/src/app/routes.js) files
    + **/src/controllers** - contains all project controllers
    + **/src/directives** - contains all project directives
    + **/src/services** - contains all project services


#### [src/app/index.js](https://github.com/nazar/angular-es6-webpack-seed/blob/master/src/app/index.js)

This is the application boot file; it defines the project's dependencies ( such as external modules, directives, controllers and services ) and routes.

#### [src/app/routes.js](https://github.com/nazar/angular-es6-webpack-seed/blob/master/src/app/routes.js)

This is the [ui-router](https://github.com/angular-ui/ui-router) configuration file and defines the following nested routes:

+ **app** - defines the application root and is linked to the ApplicationController and ApplicationTemplate and defines the application layout.
  + **app.home** - defines the application home page and is linked to the HomeController and HomeTemplate. This is the landing page.
  + **app.page1** - an example page1
  + **app.page2** - an example page2
  + **app.login** - the login page
  + **app.my** - defines the privileged state root and is linked to the AuthenticationController, which performs a basic authentication check. Un-authenticated
  users will be redirected to **app.login**. This is where **ui-router** shines as we can define nested **app.my** views that all *inherit* the authentication check
   from **app.my**
    + **app.my.profile** - a logged in user's profile page. Only accessible for logged in users. Inherits the authentication check from **app.my**

#### [controllers](https://github.com/nazar/angular-es6-webpack-seed/tree/master/src/app/controllers)

Controllers define views - i.e. ***page1***, ***page2***, ***login***. Each controller is contained in its own folder and includes:

+ index.js - style and asset imports and exports the controller function
+ Style definitions
+ HTML template
+ Images

The [myProfile](https://github.com/nazar/angular-es6-webpack-seed/tree/master/src/app/controllers/myProfile) controller best demonstrates the above
where the controller's *index.js* is:

{% codeblock src/app/controllers/myProfile lang:javascript %}
import './style.styl';
import ngImg from './images/angular.png';

export default function( $scope, $state, Authentication ) {
    'ngInject';

    $scope.ngImg = ngImg;

    $scope.logout = function() {
        Authentication.logOut();
        $state.go( 'app.home' );
    };
}
{% endcodeblock %}

`index.js` is responsible for importing the controller's style and any images. The controller's template, defined in the routes.js file is:

{% codeblock src/app/controllers/myProfile/template.html lang:html %}
<div id="my-profile">
    <div class="jumbotron">
        <h1>This! Is! My profile!!1</h1>
        <div>
            <button
                class="btn btn-default"
                ng-click="logout()">
                logout
            </button>
        </div>
        <div>
            <img ng-src="{%raw%}{{ngImg}}{%endraw%}" alt=""/>
        </div>
    </div>
</div>
{% endcodeblock %}

Note the namespaced view: `<div id="my-profile">`. The controller's style [file](/src/app/controllers/myProfile/style.styl) uses the same `#my-profile`
namespace for this controller's styles. All controllers define their own CSS namespaces.

The image is imported via `import ngImg from './images/angular.png'`. Angular requires that the image path be placed in a reference,
unlike [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) where the `require(./images/angular.png)` could be placed directly in the template. This, I think, is a minor issue.

Webpack is configured to use [ngtemplate-loader](https://github.com/WearyMonkey/ngtemplate-loader) to bundle all HTML templates into JavaScript strings which
are loaded into the application's **$templateCache**.

Each defined controller is then added to the application's module via [src/app/controllers/index.js](https://github.com/nazar/angular-es6-webpack-seed/blob/master/src/app/controllers/index.js):

{% codeblock lang:javascript %}
import angular from 'angular';

import ApplicationController from './application';
import AuthenticationController from './authentication';
import HomeController from './home';

export default angular
    .module( 'app.controllers', [] )
    .controller( 'ApplicationController', ApplicationController )
    .controller( 'AuthenticationController', AuthenticationController )
    .controller( 'HomeController', HomeController )
    .name;
{% endcodeblock %}

I like the above method of defining controllers as it separates controller names from their definitions, something that should make controller modules easier to re-use.

#### [directives](https://github.com/nazar/angular-es6-webpack-seed/tree/master/src/app/directives)

Employs the exact same folder structure and logic as **controllers**.

#### [services](https://github.com/nazar/angular-es6-webpack-seed/tree/master/src/app/services)

Services and Factories are simpler to define as they should not have any dependant assets; these can be defined using the [ES6 Class syntax](https://github.com/lukehoban/es6features#classes).

{% codeblock trivial auth.js service lang:javascript %}
export default class {
    constructor() {
        this.loggedIn = false;
    }
    logIn() {
        this.loggedIn = true;
    }
    logOut() {
        this.loggedIn = false;
    }
}
{% endcodeblock %}

The root [services](https://github.com/nazar/angular-es6-webpack-seed/tree/master/src/app/services) folder contains
an [index.js](https://github.com/nazar/angular-es6-webpack-seed/blob/master/src/app/services/index.js) file which imports all services files into the application module.

{% codeblock services/index.js lang:javascript %}
import angular from 'angular';
import auth from './auth';

export default angular
    .module( 'app.services', [] )
    .service( 'Authentication', auth )
    .name;
{% endcodeblock %}

### Development Web Server

Webpack provides the [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html) HTTP server, which is configured using the
following [base](https://github.com/nazar/angular-es6-webpack-seed/blob/master/webpack.config.js) and [development](https://github.com/nazar/angular-es6-webpack-seed/blob/master/webpack.dev.js)
 configuration files. **webpack.config.js** is the base configuration which is overridden by both **webpack.dev.js** and **webpack.prod.js**. The same logic can be used to define a test configuration file.

This configuration includes:

+ **livereload** for any JavaScript file changes - functional but as awesome as React's hot-reloading
+ **hot reloading** for CSS style and image file changes - these updates do not require a page refresh

The development server is started by issuing the `gulp` command in the project's root folder.

### Building and Deploying

The [base](https://github.com/nazar/angular-es6-webpack-seed/blob/master/webpack.config.js) webpack configuration is overridden by the
[production](https://github.com/nazar/angular-es6-webpack-seed/blob/master/webpack.prod.js) specific file to concatenate,
minify, uglify and gzip all project assets, which includes css, image and font files into the **build** folder which can
then be deployed via rsync or [shipit](https://github.com/shipitjs/shipit).

The build process can be initiated by issuing the `gulp build` command in the project's root folder.