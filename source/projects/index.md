title: Projects
date: 2015-08-14 09:57:01
---

As a software developer, I keep current by applying new technologies on side projects. Follows is a list of recent open sourced side projects where I experimented
 with various frameworks, libraries and techniques.

## Active Projects

### [Soapee](http://soapee.com)

A Soap Lye Calculator for soap making - yes, just like [Fight Club](http://www.imdb.com/title/tt0137523/). Also a recipe, oil database and a community website.

Comprises of two sub-projects:
* A ReactJS [client](https://github.com/nazar/soapee-ui).
* An ExpressJS [API server](https://github.com/nazar/soapee-api).

Experimented in using Webpack with Babel (for ES6 goodness) on the server.

## Retired Projects

### [Soundcloud Top 100 Charts](http://charts.charb.it)

Scrapes [Soundcloud](https://soundcloud.com/) daily and calculates the top 1,000 chart based on track playbacks. Also saves daily track statistics.

A project I used to become familiar with HapiJS, AngularJS and later ReactJS. Comprises of three projects:
* A [Hapi](http://hapijs.com/) based [API server](https://github.com/nazar/sound-charts-api).
* An [AngularJS UI](https://github.com/nazar/sound-charts-spa).
* I [rewrote the UI](https://github.com/nazar/sound-charts-react-spa) to experiment with ReactJS and [Reflux](https://github.com/reflux/refluxjs).

Challenges:
* Developing a custom HTML5 Audio player that is mobile friendly. Soundcloud's playback widget had issues where tracks could not be auto-played on mobiles and tablets.
* collecting statistics on the ~80,000 tracks that are uploaded to Soundcloud on a daily basis.

### [Parlmnt](https://github.com/nazar/parlmnt)

My first AngularJS and my last Ruby on Rails project. Main challenges included:
* Scrapping and categorising unstructured text from the Houses of Parliament [Hansard](http://www.parliament.uk/business/publications/hansard/commons/) website.
* Developing a Rails application using [service objects](http://blog.codeclimate.com/blog/2012/10/17/7-ways-to-decompose-fat-activerecord-models/).

### [MediaCMS](https://github.com/nazar/MediaCMS)

A large [Shutterstock](http://www.shutterstock.com/) like Ruby on Rails application allowing media owners to upload and sell images, video and audio files.

Challenged included:
* Using [Imagemagick](http://www.imagemagick.org/script/index.php) and [FFMPEG](https://www.ffmpeg.org/) to convert uploaded image, audio and video files.
* Building a background processing queue for all uploaded assets.

### [Recipe Trees](https://github.com/nazar/recipetrees)

A cooking oriented website with an ingredients and recipe database. Challenges and features:
* An ingredient database with nutritional information per ingredient. Recipe nutritional information was auto-calculated.
* Employing a [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph) to link related ingredients. Viewing the plumb tomato page would also show tinned tomatoes, tomato paste, etc...
plus all recipes that included related ingredients.
* Ability for members to fork a recipe (just like on github) and rendering a graph showing forked recipes.

### [DarkFall Sage](https://github.com/nazar/DarkFallSage)

A community based website for the [Darkfall](https://www.darkfallonline.com) MMORPG developed using Ruby on Rails. Main features and challenges:
* Employing the Google Maps Javascript API to render a zoomable in-game map - an example for [WOW](http://wyrimaps.net/wow).
* Mapping player submitted game objects (i.e. mobs, loot, etc) onto the in-game map.
* Allowing players to create their own guilds, which could create their own forums with access permissions based on guild affiliations.

### [Wasters](https://github.com/nazar/wasters)

A community based website for the [Fallen Earth](https://en.wikipedia.org/wiki/Fallen_Earth) MMORPG developed using Ruby on Rails and [Community Engine](http://communityengine.org/).
Fallen Earth employs a sophisticated crafting system where objects are recursively constructed from [BOM](https://en.wikipedia.org/wiki/Bill_of_materials) like sub-components.

The main goal of this website was to document all in-game crafting schematics and construct a dependency tree of all craftable objects and provide information such as: total resources required; total build time,
total build costs, etc