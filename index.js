const writeFile = require('write');
const TpBuilder = require('./class/builder');
const Utils = require('./class/utils');
const glob = require('glob');
const path = require('path');

/**
 * Main Process starting process
 * @param {string|object} str content
 * @param {array} options options array for tasap
 * @returns TpBuilder
 */
function TpBuilderProcess(str, options){
    let init = str;
    if (typeof str === 'object') {
        init = init.map((item) => '{{@ ' + item + ' }}').join('\n');
    }
    return new TpBuilder(init, options).parse();
}

/**
 * Main exposed object
 */
module.exports = {
    /**
     * Compiles all files into one files and returns the result
     * @param {string|array} str files to compile
     * @param {array} options options array for tasap
     * @returns {TpBuilder}
     */
    get(str, options){
        return TpBuilderProcess((str), options);
    },

    /**
     * Compiles all files into sepearte fiels and returns the array
     * @param {array} arr list of files to compile
     * @param {array} options options array for tasap
     * @returns array
     */
    getAll(arr, options){
        return arr.map((item) => this.get([item], options));
    },

    /**
     * Writes the compiled file to the target directory
     * @param {string|array} file list of files to compile
     * @param {string} target target filename
     * @param {array} options options array for tasap
     */
    writeFile(file, target, options){
        writeFile.sync(target, TpBuilderProcess(file, options));
    },

    /**
     * Compiles all matching files to the target directory
     * @param {string} items glob string for files
     * @param {string} target target filename
     * @param {array} options options array for tasap
     */
    writeAll(items, target, options){
        glob.sync(items).forEach((file) =>{
            this.writeFile([file], target + '/' + path.basename(file), options);
        });
    },

    /**
     * tasap utility class
     */
    utils: Utils
};