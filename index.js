const fs = require('fs');
const htmlparser = require('htmlparser2');
const entities  = new (require('html-entities').XmlEntities);

let content = fs.readFileSync('./index.html', 'utf-8');



class TpBuilder{
	constructor(content){
		this.raw = content;
		this.content = '';

		this.modules = {};
		this.dom = [];
	}

	parse(){
		let handler = new htmlparser.DomHandler((err, dom)=>{
			this.dom = this.buildRenderDom(dom);
		});
		var parser = new htmlparser.Parser(handler, {
			lowerCaseTags: false
		});
		parser.write(this.raw);
		parser.end();

		// console.log(JSON.stringify(this.modules, undefined, 2));
		// console.log(JSON.stringify(this.dom, undefined, 2));

		console.log(Node.renderArray(this.dom));
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
			return new Node(item, parent, ()=>this)
		});
	}
}


class Element{
	constructor(getBuilder){
		this.getBuilder = getBuilder;
	}
	buildChildrenDom(children){
		this.children = this.getBuilder().buildRenderDom(children, this, this.getBuilder);
	}

	evalExpression(content){
		let expReplace = new RegExp('{{(.*)}}'),
			expEval = new RegExp('{{# (.*)}}'),
			evalPoly = (str)=>{
				return eval('(' + str + ')')
			};


		content = content.replace(expEval, (str, p1)=>{
			evalPoly(p1);
			return '';
		}).replace(expReplace, (str, p1)=>{
			return evalPoly(p1);
		});
		return content;
	}
}


class Node extends Element{
	constructor(node, parent, getBuilder){
		super(getBuilder)

		this.parent = parent;
		this.state = {};

		this.type = node.type;
		if (this.type === 'text') {
			this.data = node.data
		}
		else{
			this.name = node.name;
			this.attributes = node.attribs;
			this.buildChildrenDom(node.children);
		}
	}
	render(){
		this.inheritState();

		let out = '';
		if (this.type === 'text') {
			out += this.evalExpression(this.data);
		}
		else{
			let isClosing = (Node.isClosingTag(this.name) && !this.children.length);
			out += '<' + this.name + this.getAttributeString() + ((isClosing)? ' /' : '') + '>';
			if (!isClosing) {
				out += Node.renderArray(this.children);
				out += '</' + this.name + '>';
			}
		}
		return out;
	}

	getAttributeString(){
		let out = '';
		for(let att in this.attributes){
			out += ' ' + att + '="' + entities.encode(this.attributes[att]) + '"';
		}
		return out;
	}

	inheritState(){
		let parentState = {};
		if (this.parent && this.parent.state) {
			parentState = this.parent.state
		}
		this.state = Object.assign({}, parentState, this.state);
	}

	static renderArray(arr){
		return arr.reduce((str, item)=>str+item.render(), '');
	}
	static isClosingTag(tag){
		return ['br','input','meta','link'].indexOf(tag) >= 0
	}
}




class ModuleNode extends Node{
	constructor(module, node, parent, getBuilder){
		super(node, parent, getBuilder);
		this.module = module;
		this.state = Object.assign(this.module.attributes, this.attributes);
		this.moduleChildren = this.children;
		this.buildChildrenDom(this.module.node.children);
	}
	render(){
		this.inheritState();
		let out = Node.renderArray(this.children);
		return out;
	}
	inheritState(){
		super.inheritState();
		if (this.state.Block) {
			this.state.parentBlock = this.state.Block;
		}
		this.state.Block = ()=>Node.renderArray(this.moduleChildren);
	}
}




class Module extends Element{
	constructor(node, getBuilder){
		super(getBuilder);
		this.node = node;
		this.attributes = node.attribs;
		this.name = node.attribs.name;
		delete this.attributes.name;
		// this.buildChildrenDom(node.children);
	}
}


let builder = new TpBuilder(content);
builder.parse();