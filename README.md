# WebsiteJS

A modular frontend architecture.

This document serves as a reference for developing a frontend based on the modular frontend architecture.

> Please note that since this project is still in its early stages of development, these practices
may be subject to change. They will stabilize as we near towards a full release.

## Prerequisites
Make sure you have installed NodeJS 7.5 or above [here](http://www.nodejs.org).
This project uses Node Package Manager (npm) to manage dependencies and Gulp to compile the sourcecode.
*Make sure npm is version 3.10 or above.*

### Updating NPM
```sh
npm install --global npm
```

### Install Gulp command
*If you've previously installed gulp globally, run `npm rm --global gulp` before following these instructions.*
```sh
npm install --global gulp-cli
```

### First run
Switch to the projectroot and run
```sh
npm install
```

> *More information about how to setup and get started should go here.*

## Components
Components are the *building blocks* of the frontend. The pages we create will all consist of a number of components.
Components have seperated code bases, so they can exist as stand-alone components and they can easily be reused in other projects.
All code needed to create a component (html/css/js) should be in it's own folder within the components folder.
Below is an overview of a typical component folder layout.
```
components
  ├── component
      ├── README.md # The component's README
      ├── component.html # The component's view (template)
      ├── component.js # The component's javascript
      ├── _component.scss # The main source file for the component's CSS
      └── component.gspec # The components test file
```
> *More on components here.*


## Elements
Elements are the *building blocks* of the components. The components we create will all consist of a number of elements.
Elements also have seperated code bases, so they can easily be reused in other projects.
All code needed to create a element (html/css/js) should be in it's own folder within the elements folder.
Below is an overview of a typical element folder layout.
```
elements
  ├── element
      ├── README.md # The element's README
      ├── element.html # The element's view (template)
      ├── element.js # The element's javascript
      ├── _element.scss # The main source file for the element's CSS
      └── element.gspec # The components test file
```
> *More on elements here.*

## Icons
We should prefer the use of SVG icons, but sometimes it is necessary to include icons fonts (as well).
SVG icons make use of a generated icons spritesheets which is injected in te document body at pageload. We can refer to the icons based on icon ID.
These ID's are also generated and are based on the directory structure of the svg icon set. The base directory for svg icons is assets/icons/svg-icons/.
See folder structure below.
```
assets
  ├── icons
        ├── svg-icons
              ├── social
                  ├── facebook.svg # icon id whould be *#social-facebook*
                  ├── twitter.svg # icon id whould be *#social-twitter*
                  └── instagram.svg # icon id whould be *#social-instagram*
              ├── ui
                  ├── close.svg # icon id whould be *#ui-close*
                  ├── plus.svg # icon id whould be *#ui-plus*
                  └── arrow.svg # icon id whould be *#ui-arrow*
```

### Adding a SVG icon
Normally the icons will be created in Illustrator and the default export from illustrator should be fine. The sources files will be minified/cleaned up when building, so comments etc will not be an issue.

If you decide to make your own, create an svg-file inside the svg-icons folder. In there the minimum code should be as follows.
```sh
<svg viewBox="0 0 48 48">
    <path d=""></path>
</svg>
```
Make sure to not add a ```<symbol>``` tag around the path or the svg, then your icon won't work.

#### Titles and groups
Ideally you'll want to add a ```<title>``` to your icon, screenreaders will read the defined title.
Optionally you can add a ```<g>``` (group) to isolate multiple paths or fills as a grouped icon.
```sh
<svg viewBox="0 0 48 48">
    <g>
        <title>Download</title>
        <path d=""></path>
    </g>
</svg>
```

### Using SVG icons
If you want to use and insert an icon, use the id "#<foldername>-<svgname>" inside a ```<use>```-tag. SVG Icons should always have an ```<svg>```-tag with the minimum base class "icon". See below.
```sh
<svg class="icon">
    <use xlink:href="#foldername-svgname"></use>
</svg>
```

> *More docs here.*

## Building the project
There are a number of build task, each build their own part of the project.
The main build tasks are:
```sh
gulp (default)
gulp prod
gulp all
gulp server
gulp serve
gulp watch
```
Normally you would start working on your project and run ```gulp all``` and then start the server and watch for file changes with ```gulp serve```.

> *More on building here.*

## Local server
To start the local server, run
```sh
gulp server
```

To start a local server and simultaniously 'watch' your files, run
```sh
gulp serve
```

## Versioning
The newversion argument should be a valid semver string, a valid second argument to [semver.inc](https://github.com/npm/node-semver#functions).
To update the version of the code, use
```sh
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
```

## Testing (Pre Alpha!)

You need the [Java JRE/JDK](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html#javasejdk) in order to run testing.
*Note: currently does not work as expected*

#### Webdrivers
If you want to test with You will also need to download the webdrivers suitable for your system and place them in a "webdrivers" folder next to your gulpfile.

* FireFox: [geckodriver.exe](https://github.com/mozilla/geckodriver/releases/)
* Chrome: [cromedriver.exe](http://chromedriver.storage.googleapis.com/index.html)
* Edge: [MicrosoftWebDriver.exe](http://go.microsoft.com/fwlink/?LinkId=619687) NOTE: check windows build number and download correct driver
* Internet Explorer: [IEDriverServer.exe](http://selenium-release.storage.googleapis.com/index.html)


## Demo / Styleguide

Visit /styleguide on your server.

## License

[The MIT License (MIT)](http://opensource.org/licenses/mit-license.php)

