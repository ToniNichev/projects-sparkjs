
const fs = require('fs');
const chalk = require('chalk');
const ConcatSource = require("webpack-sources").ConcatSource;


module.exports = class DemoPlugin {
  
  constructor(options) {
    this.validateOptions(options);
    this.options = options;
  }


  validateOptions(options) {
    if (!options || !options.outputPath) {
      const msg = `Please specify an outputPath.`;
      throw new Error(console.log(chalk.bold.bgRed('Error:'), chalk.bold.red(msg)));
    }
  }  


  async toReplace(source) {
    var patt = /\s*console.log\([^\)]*\)(;|)/i;
    var result = source.replace(patt, '');

    return result;
  }

  
  async findChunks(compilation){
    let chunks = compilation.chunks;
    var self = this;
    for (let i = 0, len = chunks.length; i < len; i++) {
        for(var file of chunks[i].files)
        {
          (async(file,self)=> {
            let source = compilation.assets[file].source();

            const filename = 'cache/' + file;
            fs.writeFile(filename, source, function (err) {
              if (err) return console.log(err);
              console.log('writing > ' + file );
            });

            const replaceSource = await self.toReplace(source);
            compilation.assets[file]= new ConcatSource(replaceSource);

          })(file,self)
        }
    }
  }

  apply(compiler) {

    compiler.hooks.done.tap('Hello World Plugin', (
      stats /* stats is passed as an argument when done hook is tapped.  */
    ) => {
      console.log('Hello World!');
    });
    
    
  	const startTime = Date.now();
    var self = this;
    //compiler.plugin('emit',async function(compilation, callback) {
      
    compiler.hooks.emit.tapAsync('FileListPlugin TEST NAME', (compilation, callback) => {
        self.findChunks(compilation)
        console.info('[build time]:'+parseInt((Date.now()-startTime) / 1000)+'s')
        callback();
    });
  }
};


