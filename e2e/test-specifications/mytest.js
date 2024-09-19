//const Seven = require('node-7z');
const fs = require('fs');
const unzipper = require('unzipper/unzip');
var exec = require('child_process').exec;


console.log('This example is different!');
console.log('The result is displayed in the Command Line Interface');




      // actual test

      fs.createReadStream('./ThyagaNode.iso')
            .pipe(unzipper.Extract({ path: './ThyagaNode' }));
      
/*
      const myStream1 = Seven.list('./thyaga.spec.zip', {
        $cherryPick: ['*.txt*', '*.js'],
      })

      const myStream = Seven.extractFull('../../ThyagaNode.iso', './output/dir/', { 
        recursive: true,
      })

      mySevenStream.on('data', function (data) {
        console.log(data)
      })
      
*/


const util = require('util');
const exec = util.promisify(require('child_process').exec);
async function ls() {
    const { stdout, stderr } = await exec('ls');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  }
  ls();