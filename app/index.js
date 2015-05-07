'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var slash = require('slash')

var GrumpGenerator = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../package.json');
	},

	setupRoot: function() {
		var hbsOptions = {
			nested: false,
			appType: 'standard',
			appName: this.appName,
			appNS: this.appNS,
			jsPath: slash(path.join(this.srcDir, this.jsPath)),
			srcDir: this.srcDir || null,
			buildDir: this.buildDir || null,
			connectPort: 3000,
			createController: true,
			controllerName: 'home',
			createExampleClasses: false
		};

		this.composeWith( 'hanbs:standard-app', {
			arguments: ['grump'],
			options: hbsOptions
		} );
	},

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log( yosay('Welcome to Grump-Grump!' ) );

		var prompts = [
			{
				name: 'appName',
				message: 'What\'s the name of your application?',
				default: 'Example Grump Application'
			},
			{
				name: 'appNS',
				message: 'What\'s the namespace of your app?',
				default: 'APP'
			},
			{
				name: 'srcDir',
				message: 'Where is your source directory?',
				default: 'src'
			},
			{
				name: 'srcDir',
				message: 'Where would you like to store HTML includes (inside the source folder)?',
				default: 'includes'
			},
			{
				name: 'jsPath',
				message: 'Where would you like to store your JavaScript files (inside the source folder)?',
				default: 'js'
			},
			{
				name: 'imgPath',
				message: 'Where would you like to keep images (inside the source folder)?',
				default: 'img'
			},
			{
				name: 'fontsPath',
				message: 'Where would you like to put your fonts (inside the source folder)?',
				default: 'fonts'
			},
			{
				name: 'stylePath',
				message: 'Where would you like to put your stylesheets (inside the source folder)?',
				default: 'less'
			},
			{
				name: 'compiledStylePath',
				message: 'Where would you like your compiled stylesheets to be output (inside the build folder)?',
				default: 'css'
			},
			{
				name: 'buildDir',
				message: 'Where would you like your build directory?',
				default: 'build'
			},
			{
				type: 'input',
				name: 'connectPort',
				options: {
					type: 'number'
				},
				message: 'What port would you like grunt-connect web server to run on?',
				default: 3000
			},
			{
				type: 'confirm',
				name: 'includeCompress',
				message: 'Do you want a task to generate a ZIP file of your project?',
				default: true
			},
			{
				type: 'confirm',
				name: 'includeFileindex',
				message: 'Do you want a task to generate a template listing at the root of your project?',
				default: true
			}
		];

		this.prompt(prompts, function (props) {
			this.includeCompress = props.includeCompress;
			this.includeFileindex = props.includeFileindex;
			this.connectPort = props.connectPort;
			this.appName = props.appName;
			this.appNS = props.appNS;
			this.jsPath = props.jsPath;
			this.imgPath = props.imgPath;
			this.stylePath = props.stylePath;
			this.compiledStylePath = props.compiledStylePath;
			this.fontsPath = props.fontsPath;
			this.srcDir = props.srcDir;
			this.buildDir = props.buildDir;
			this.connectPort = props.connectPort;

			done();
		}.bind(this));


	},

	writing: {
		app: function () {
			this.template('_package.json', 'package.json');
			this.template('_bower.json', 'bower.json');
		},

		projectfiles: function () {
			this.src.copy('editorconfig', '.editorconfig');
			this.src.copy('jshintrc', '.jshintrc');

			this.mkdir(this.buildDir);
			this.mkdir(this.srcDir);
			this.mkdir( slash(path.join(this.srcDir, this.stylePath)) );
			this.mkdir( slash(path.join(this.srcDir, this.fontsPath)) );
			this.mkdir( slash(path.join(this.srcDir, this.imgPath)) );

			this.src.copy('less/app.less', slash(path.join(this.srcDir, this.stylePath, 'app.less')) );
			this.src.copy('includes/header.html', slash(path.join(this.srcDir, this.includesPath, 'header.html')) );
			this.src.copy('includes/footer.html', slash(path.join(this.srcDir, this.includesPath, 'footer.html')) );

			this.template('example.html', slash(path.join(this.srcDir, 'example.html')) );
		},

		gruntfile: function() {
			// Add gruntfile configs
			this.gruntfile.insertConfig('bake', "{ default: { files: { '" + slash(path.join(this.buildDir, '/example.html') + "': '" + path.join(this.srcDir, '/example.html') + "' } } }"));
			this.gruntfile.insertConfig('connect', "{ server: { options: { port: " + this.connectPort + ", keepalive: true, livereload: true, base : '" + this.buildDir + "', hostname: '*' } } }");
			this.gruntfile.insertConfig('copy', "{ js: { files: [ { expand: true, cwd: '" + slash(path.join(this.srcDir, this.jsPath)) + "', src: ['**'], dest: '" + slash(path.join(this.buildDir, this.jsPath)) + "' } ] }, img: { files: [ { expand: true, cwd: '" + slash(path.join(this.srcDir, this.imgPath)) + "', src: ['**'], dest: '" + slash(path.join(this.buildDir, this.imgPath)) + "' } ] }, fonts: { files: [ { expand: true, cwd: '" + slash(path.join(this.srcDir, this.fontsPath)) + "', src: ['**'], dest: '" + slash(path.join(this.buildDir, this.fontsPath)) + "' } ] } }");
			this.gruntfile.insertConfig('imagemin', "{ png: { options: { optimizationLevel: 7 }, files: [ { expand: true, cwd: '"+ slash(path.join(this.srcDir, this.imgPath)) + "', src: ['**/*.{png,jpg}'], dest: '"+ slash(path.join(this.srcDir, this.imgPath)) + "' } ] } }");
			this.gruntfile.insertConfig('less', "{ default: { files: { '" + slash(path.join(this.buildDir, this.compiledStylePath, 'app.css')) + "': '" + slash(path.join(this.srcDir, this.stylePath, 'app.less')) + "' } } }");
			this.gruntfile.insertConfig('uglify', "{ js: { files: { '" + slash(path.join(this.buildDir, this.jsPath, 'libs.js')) + "' : ['" + slash(path.join(this.srcDir, this.jsPath, 'lib/hbs.js')) + "'] } } }");
			this.gruntfile.insertConfig('watch', "{ less: { files: ['" + slash(path.join(this.srcDir, '**/*.less')) + "'], tasks: ['less'], options: { livereload: true } }, html: { files: ['" + slash(path.join(this.srcDir, '**/*.html')) + "'], tasks: ['bake'], options: { livereload: true } }, js: { files: ['" + slash(path.join(this.srcDir, '**/*.js')) + "'], tasks: ['copy', 'uglify'], options: { livereload: true } }, img: { files: ['" + slash(path.join(this.srcDir, '**/*.{png,gif,jpg}')) + "'], tasks: ['copy:img', 'imagemin'] } }");

			// Optional task configs
			if (this.includeCompress) {
				this.gruntfile.insertConfig('compress', "{ default: { options: { archive: 'project.zip' }, files: [ {src: ['" + slash(path.join(this.buildDir, '**')) + "'], dest: '/'}, {src: ['docs/**'], dest: '/'}, {src: ['" + slash(path.join(this.srcDir, '**')) + "'], dest: '/'}, {src: ['Gruntfile.js'], dest: '/'}, {src: ['package.json'], dest: '/'} ] } }");
			}

			if (this.includeFileindex) {
				var fiConfig = "{\r\n\tcustom: {\r\n\t\t\t\toptions: {\r\n\t\t\t\t\tformat: function (list, options, dest) {\r\n\t\t\t\t\t\tvar html = \'<html><head><meta name=\"viewport\" content=\"width=device-width;\" \/><\/head><body>\';\r\n\t\t\t\t\t\thtml = html.concat(\'<h1>Template Listing<\/h1>\\n\\n<ul>\\n\');\r\n\t\t\t\t\t\tfor (var i in list) {\r\n\t\t\t\t\t\t\tif (!list.hasOwnProperty(i)) { continue; }\r\n\t\t\t\t\t\t\tvar next = list[i];\r\n\t\t\t\t\t\t\thtml = html.concat(\'<li><a href=\"\' + next + \'\">\' + next + \'<\/a><\/li>\\n\');\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\thtml = html.concat(\'<\/ul>\');\r\n\t\t\t\t\t\thtml = html.concat(\'<\/body><\/html>\');\r\n\r\n\t\t\t\t\t\treturn html;\r\n\t\t\t\t\t}\r\n\t\t\t\t},\r\n\t\t\t\tfiles: [\r\n\t\t\t\t\t{dest: '" + slash(path.join(this.buildDir, 'index.html')) + "', src: [\'*.html\'], cwd: '" + this.srcDir + "', filter: \'isFile\'}\r\n\t\t\t\t]\t\r\n\t\t\t}\r\n}";
				this.gruntfile.insertConfig('fileindex', fiConfig);
			}

			// Load NPM tasks
			this.gruntfile.loadNpmTasks('grunt-bake');
			this.gruntfile.loadNpmTasks('grunt-contrib-connect');
			this.gruntfile.loadNpmTasks('grunt-contrib-copy');
			this.gruntfile.loadNpmTasks('grunt-contrib-imagemin');
			this.gruntfile.loadNpmTasks('grunt-contrib-less');
			this.gruntfile.loadNpmTasks('grunt-contrib-uglify');
			this.gruntfile.loadNpmTasks('grunt-contrib-watch');

			// Load optional NPM tasks
			if (this.includeCompress) {
				this.gruntfile.loadNpmTasks('grunt-contrib-compress');
			}

			if (this.includeFileindex) {
				this.gruntfile.loadNpmTasks('grunt-fileindex');
			}

			// Register default tasks
			var defaultTasks = ['less', 'bake', 'uglify', 'copy'];

			// Optional task
			if (this.includeFileindex) {
				defaultTasks.push('fileindex')
			}

			this.gruntfile.registerTask('default', defaultTasks);

			// Optional task
			if (this.includeCompress) {
				this.gruntfile.registerTask('compress', ['compress']);
			}
		}
	},

	install: function () {
		// Default dependencies
		var deps = [
			'grunt',
			'grunt-bake',
			'grunt-contrib-connect',
			'grunt-contrib-copy',
			'grunt-contrib-imagemin',
			'grunt-contrib-less',
			'grunt-contrib-uglify',
			'grunt-contrib-watch'
		];

		// Optional dependencies
		if (this.includeCompress) {
			deps.push('grunt-contrib-compress')
		}

		if (this.includeFileindex) {
			deps.push('grunt-fileindex');
		}

		this.npmInstall( deps, {'saveDev': true}, null );

		var bowerDeps = [
			'bootstrap'
		];

		this.bowerInstall( bowerDeps, {'saveDev': true}, null );

	},

	end: function () {
		//this.installDependencies();
	}
});

module.exports = GrumpGenerator;
