import {execSync} from 'child_process'
import { lstatSync, readdirSync } from 'fs';
import {join} from 'path';

process.chdir('multiple-blocks-plugin');

const getDirectories = source =>
  readdirSync(source)

const blockNames = getDirectories('blocks');

let i = 0;
blockNames.forEach(blockName=>{
    i++;
    console.log('building '+i+"/"+blockNames.length+ " ("+blockName+")")
    execSync(`wp-scripts build --webpack-src-dir=blocks/`+blockName+`/src/ --output-path=blocks/`+blockName+`/build/`)
})