const TpBuilder = require('./class/builder');

function TpBuilderProcess(str){
	let init = str;
	if (typeof str === 'object') {
		init = init.map((item)=>'{{@ ' + item + ' }}').join('\n');
	}
	return new TpBuilder(init).parse();
}

module.exports = TpBuilderProcess;