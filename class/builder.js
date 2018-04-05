const htmlparser = require('htmlparser2');
const beautifyHtml = require('js-beautify').html;
const glob = require('glob');
const fs = require('fs');

const Module = require('./module');
const Node = require('./node');
const ModuleNode = require('./module-node');


class TpBuilder{
	constructor(content){
		this.raw = content;
		this.content = '';

		this.modules = {};
		this.dom = [];
	}

	includeFiles(){
		let exp = new RegExp('{{@ (.*)}}', 'g');
		this.raw = this.raw.replace(exp, (str, p1)=>{
			return glob.sync(p1)
				.map((item)=>fs.readFileSync(item, 'utf-8'))
				.reduce((str, item)=>str + ' ' + item, '');
		});
		if (this.raw.match(exp)) {
			this.includeFiles();
		}
	}

	parse(){
		this.includeFiles();

		let handler = new htmlparser.DomHandler((err, dom)=>{
			this.dom = this.buildRenderDom(dom);
		});
		var parser = new htmlparser.Parser(handler, {
			lowerCaseTags: false
		});
		parser.write(this.raw);
		parser.end();

		this.content = Node.renderArray(this.dom);
		this.formatOutput();
		return this.content;
	}

	formatOutput(){
		this.content = beautifyHtml(this.content, {
			preserve_newlines: false,
			unformatted: ['script', 'style']
		});
		
	}

	buildRenderDom(nodeArray, parent = null){
		return nodeArray.filter((item)=>{
			if (item.type === 'tag' && item.name === 'Module') {
				let name = item.attribs.name.trim();
				if (!name){
					throw new Error('Module has no name.');
				}
				if (this.modules[name] !== undefined){
					throw new Error('Module with the name ' + name + ' is already defined.');
				}
				this.modules[name] = new Module(item, ()=>this);
				return false;
			}
			return true;
		}).map((item)=>{
			if (this.modules[item.name] !== undefined) {
				return new ModuleNode(this.modules[item.name], item, parent, ()=>this);
			}
			return new Node(item, parent, ()=>this);
		});
	}
}

module.exports = TpBuilder;