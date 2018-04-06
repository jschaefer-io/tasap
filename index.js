const writeFile = require('write');
const TpBuilder = require('./class/builder');
const glob = require('glob');
const path = require('path');

function TpBuilderProcess(str, options){
	let init = str;
	if (typeof str === 'object') {
		init = init.map((item)=>'{{@ ' + item + ' }}').join('\n');
	}
	return new TpBuilder(init, options).parse();
}

module.exports = {
	get(str, options){
		return TpBuilderProcess((str), options);
	},
	getAll(arr, options){
		return arr.map((item)=>this.get([item], options));
	},
	writeFile(file, target, options){
		writeFile.sync(target, TpBuilderProcess(file, options));
	},
	writeAll(items, target, options){
		glob.sync(items).forEach((file)=>{
			this.writeFile([file], target + '/' + path.basename(file), options);
		});			
	}
};