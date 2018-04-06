const writeFile = require('write');
const TpBuilder = require('./class/builder');
const glob = require('glob');
const path = require('path');

function TpBuilderProcess(str){
	let init = str;
	if (typeof str === 'object') {
		init = init.map((item)=>'{{@ ' + item + ' }}').join('\n');
	}
	return new TpBuilder(init).parse();
}

module.exports = {
	get(str){
		return TpBuilderProcess((str));
	},
	getAll(arr){
		return arr.map((item)=>this.get([item]));
	},
	writeFile(file, target){
		writeFile.sync(target, TpBuilderProcess(file));
	},
	writeAll(items, target){
		glob.sync(items).forEach((file)=>{
			this.writeFile([file], target + '/' + path.basename(file))
		});			
	}
};