const entities  = new (require('html-entities').XmlEntities);

const Element = require('./element');

class Node extends Element{
	constructor(node, parent, getBuilder){
		super(getBuilder);

		this.parent = parent;
		this.state = {};

		this.type = node.type;
		if (this.type === 'text') {
			this.data = node.data;
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
		this.pushState();
		return out;
	}

	getAttributeString(){
		let out = '';
		for(let att in this.attributes){
			out += ' ' + att + '="' + entities.encode(this.evalExpression(this.attributes[att])) + '"';
		}
		return out;
	}

	inheritState(){
		let parentState = {};
		if (this.parent && this.parent.state) {
			parentState = this.parent.state;
		}
		this.state = Object.assign({}, parentState, this.state);
	}

	pushState(){
		if (this.parent && this.parent.state) {
			this.parent.state = this.state;
		}
	}

	static renderArray(arr){
		return arr.reduce((str, item)=>str+item.render(), '');
	}
	static isClosingTag(tag){
		return ['br','input','meta','link'].indexOf(tag) >= 0;
	}
}


module.exports = Node;