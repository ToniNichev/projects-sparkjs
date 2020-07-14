const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");

const fs = require('fs');
const chalk = require('chalk');
const ConcatSource = require("webpack-sources").ConcatSource;



module.exports = class DemoPlugin {
  
  constructor(options) {
    this.validateOptions(options);
    this.options = options;
    this.shouldReadFromCache = false;
  }

  validateOptions(options) {
    if (!options || !options.outputPath) {
      const msg = `Please specify an outputPath.`;
      throw new Error(console.log(chalk.bold.bgRed('Error:'), chalk.bold.red(msg)));
    }
  }  

  beforeCompile(compiler, callback) {
    console.log("!!!!!!!!!!!!! beforeCompile");
  }


  apply(compiler) {

  	const startTime = Date.now();
    var self = this;
    this.compiler = compiler;    
    compiler.hooks.autodllStatsRetrieved = new SyncHook(['stats', 'source']);
    
    compiler.hooks.beforeCompile.tapAsync('MyPlugin', (params, callback) => {
      console.log('====== beforeCompile ==========');
      //const dependencies = new Set(params.compilationDependencies);
      //[...dependencies].filter(path => !path.startsWith(cacheDir));
      //console.log(params.compilationDependencies);
      //return;
      callback();
    });       


    compiler.hooks.watchRun.tapAsync('MyPlugin', (compiler, callback) => {
      console.log('====== watchRun ==========');
      //return;

      
      callback();
    });    


    compiler.hooks.emit.tapAsync('FileListPlugin TEST NAME', (compilation, callback) => {
      console.log('====== emit ==========');
      for (let [filename, asset] of Object.entries(compilation.assets)) {

        if(this.shouldReadFromCache) {
          this.readFromCache(filename, compilation, data => {
            compilation.assets[filename] = new ConcatSource(data);        
            callback();
          });
        }
        else {
          this.writeToCache(filename, asset);
          callback();
        }
      }
      console.info('[build time]:'+parseInt((Date.now()-startTime) / 1000)+'s');
    });               
  }

  readFromCache(filename, compilation, callback) {
    const fullFilename = this.getFullFilPath(filename);
    fs.readFile(fullFilename, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      //data = "alert()\n" + data;
      callback(data);
      console.log("[reading] ",fullFilename);
    });    
  }

  writeToCache(filename, asset) {
    const fullFilename = this.getFullFilPath(filename);    
    let source = asset.source();
    fs.writeFile(fullFilename, source, function (err) {
      if (err) return console.log(err);
      console.log('[writing]' + fullFilename );
    });    
  }

  getFullFilPath(filename) {
    return 'cache/' + filename;        
  }

};


