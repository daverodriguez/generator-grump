![Grump-grump](assets/grump-grump-logo.png)

---------------------

Grump-grump is a [Yeoman](http://yeoman.io) generator. It installs all the Grunt plugins you need for simple build projects,
including:

- [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) - A lighweight local web server
- [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) - To monitor and automatically rebuild when files in your project change
- [grunt-bake](https://github.com/MathiasPaumgarten/grunt-bake) - Simple templating and includes for  HTML
- [grunt-contrib-less](https://github.com/gruntjs/grunt-contrib-less) - LESS CSS preprocessing
- [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify) - For concatenating and minifying JavaScript
- [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy) - Automatically copies files from the source to the build folder
- [grunt-contrib-imagemin](https://github.com/gruntjs/grunt-contrib-imagemin) - Optimizes images added to your project

Grump-grump also preconfigures your plugins in Gruntfile.js to get you started more quickly!

**Coming Soon to NPM, once I test it :)**

## Instructions
To install Grump-grump from npm, open up a console and run:

```
npm install -g yo generator-grump
```

Initiate the generator with `yo grump`. Go get a cup of coffee, this is going to take a while.

Once everything is installed, run `grunt` to build the project and `grunt connect` to start a local web server.
Grump-grump installs everything you need to start building HTML templates using LESS and bake (for including HTML partials).

Use `grunt watch` while you're developing and Grump-grump will monitor your image, LESS, JS, and font folders for changes
and trigger a build when necessary (with livereload!)

## License

Grump-grump is distributed under the MIT license.
