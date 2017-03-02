# websitejs
Modular Frontend Architecture

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/websitejs/websitejs/master/LICENSE)

## Setup
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

### Build files
Before starting the local server, make sure you run 
```sh
gulp all 
```

## Local server
To start the local server, run
```sh
gulp server
```

To start a local server and simultaniously 'watch' your files, run
```sh
gulp serve
```

## Add and use SVG icons

Setup for adding an icon. Make a file "svgname.svg" inside the folder assets/icons/svg-icons/foldername. In there the minimum code should be as follows.
```sh
<svg viewBox="0 0 48 48">
    <path d=""></path>
</svg>
```
Make sure to not add a ```<symbol>``` tag around the path or the svg, then your icon won't work.
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

If you want to insert an icon, use the id "foldername-svgname". Then your icon will be shown.
```sh
<svg class="icon">
    <use xlink:href="#foldername-svgname"></use>
</svg>
```

## Versioning
The newversion argument should be a valid semver string, a valid second argument to [semver.inc](https://github.com/npm/node-semver#functions).
To update the version of the code, use
```sh
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
```

## Testing (Pre Alpha!)

You need the [Java JRE/JDK](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html#javasejdk) in order to run testing.

#### Webdrivers
If you want to test with You will also need to download the webdrivers suitable for your system and place them in a "webdrivers" folder next to your gulpfile.

* FireFox: [geckodriver.exe](https://github.com/mozilla/geckodriver/releases/)
* Chrome: [cromedriver.exe](http://chromedriver.storage.googleapis.com/index.html)
* Edge: [MicrosoftWebDriver.exe](http://go.microsoft.com/fwlink/?LinkId=619687) NOTE: check windows build number and download correct driver
* Internet Explorer: [IEDriverServer.exe](http://selenium-release.storage.googleapis.com/index.html)


## Demo / Styleguide

Visit /styleguide on your server.

## Credits

Created by [Rocco Janse](http://roccojanse.nl), [roccojanse@outlook.com](mailto:roccojanse@outlook.com)

## License

[The MIT License (MIT)](http://opensource.org/licenses/mit-license.php)
